var path = require('path');
var helper = require('./modulehelper');
var Promise = require('bluebird');
var filter = helper.filter;
var fs = Promise.promisifyAll(require('fs'));

var _disable = helper.disable;
var _enable = helper.enable;

module.exports = function(sails) {
    return {
        loadedModules: [],

        initialize: function(cb) {
            if(!sails.config.rootPath) {
                sails.config.rootPath = path.join(sails.config.paths.config, '..');
            }

            if(!sails.config.modules) {
                sails.config.modules = {};
            }

            var self = this;
            var waitFor = ['hook:app:loaded', 'hook:chat:loaded'];
            var modules = filter(sails.config.modules);
            var waiting = [];
            sails.afterAsync(waitFor).then(function() {
                return Promise.map(modules, function(moduleInfo) {
                    sails.log.info('Loading module with id `' + moduleInfo.name + '` ...');
                    var moduleMain;
                    if(moduleInfo.source === 'npm') {
                        moduleMain = require(moduleInfo.name);
                    } else if(moduleInfo.source === 'local') {
                        moduleMain = require(path.join(sails.config.rootPath, moduleInfo.path));
                    }

                    var result = Promise.promisifyAll(moduleMain(sails.app, sails.chat));
                    if(!result.name)
                        result.name = moduleInfo.name;

                    result.path = (moduleInfo.source === 'npm' ? path.join(sails.config.rootPath, 'node_modules', moduleInfo.name) : path.join(sails.config.rootPath, moduleInfo.path));
                    result.relPath = (moduleInfo.source === 'npm' ? path.join('.', 'node_moodules', moduleInfo.name) : path.join('.', moduleInfo.path));
                    result.log = ModuleService.createModuleLogger(result.name);
                    result.displayName = result.name.charAt(0).toUpperCase() + result.name.slice(1);
                    return Promise.resolve().then(function() {
                        /*if(!_.has(sails.config.modules, result.name)) {
                            return ModuleService.generateDefaultConfig(result);
                        }*/
                    }).then(function() {
                        if(typeof(result.init) === "function") {
                            return result.initAsync().then(function() {
                                self.loadedModules.push(result);
                                return result;
                            });
                        } else {
                            self.loadedModules.push(result);
                            return result;
                        }
                    }).then(function(mod) {
                        mod.loaded = true;
                        sails.app.modules[mod.name] = mod;
                        sails.emit('modules:' + mod.name + ':init');
                        mod.log.verbose('Finished initializing.');
                        ModuleService.registerCustomModels(mod);
                        ModuleService.registerCustomControllers(mod);
                        ModuleService.registerCustomRoutes(mod);
                        return mod;
                    }).catch(function(err) {
                        result.log.error("Error initializing: " + err.message);
                    });
                }, { concurrency: 5 }).then(function(initializedModules) {
                    sails.emit('hook:moduleloader:modulesinit');
                    sails.log.verbose('Initialized all modules.');
                    sails.emit('hook:moduleloader:custommodels');
                    return _.filter(initializedModules);
                });
            }).then(function(initialized) {
                cb(null, initialized);
            }).catch(function(err) {
                sails.log.error(err);
                cb();
            });
        },
        enableAll: function() {
            return Promise.map(this.loadedModules, _enable).then(function() {
                sails.emit('hook:modulesloader:modulesenable');
                sails.log.info('Loaded all modules.');
            });
        },
        enable: function(name) {
            var mod = _.find(this.loadedModules, function(mod) { mod.name === name });
            if(mod)
                return _enable(mod);
        },

        disable: function(name) {
            var mod = _.find(this.loadedModules, function(mod) { mod.name === name });
            if(mod)
                _disable(mod);
        },
        disableAll: function() {
            this.loadedModules.forEach(_disable);
        },

        teardown: function(cb) {
            this.disableAll();
        }
    };
};
