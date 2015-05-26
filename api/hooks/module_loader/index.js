var path = require('path');
var helper = require('./modulehelper');
var Promise = require('bluebird');
var filter = helper.filter;
var fs = Promise.promisifyAll(require('fs'));

var _disable = helper.disable;
var _enable = helper.enable;

module.exports = function moduleloader(sails) {
    return {
        loadedModules: [],
        filteredModules: [],

        initialize: function(cb) {
            if(!sails.config.rootPath) {
                sails.config.rootPath = path.join(sails.config.paths.config, '..');
            }

            if(!sails.config.modules) {
                sails.config.modules = {};
            }

            var waitFor = ['hook:app:loaded', 'hook:chat:loaded'];
            this.filteredModules = filter(sails.config.modules);
            sails.afterAsync(waitFor).then(this.loadAll).then(function(initialized) {
                cb(null, initialized);
            }).catch(function(err) {
                cb(err);
            });
        },


        loadAll: function() {
            var self = this;
            return Promise.map(self.filteredModules, function(moduleInfo) {
                    sails.log.info('Loading module with id `' + moduleInfo.name + '` ...');
                    return Promise.resolve().then(function() {
                        return helper.create(moduleInfo);
                    }).then(function(mod) {
                        if(!_.has(sails.config.moduleconfig, mod.name)) {
                            return ModuleService.generateDefaultConfig(mod);
                        }

                        return mod;
                    }).then(function(mod) {
                        if(mod.init && typeof(mod.init) === "function") {
                            return mod.initAsync().then(function() { return mod; });
                        }

                        return mod;
                    }).then(function(mod) {
                        self.loadedModules.push(mod);
                        mod.loaded = true;
                        sails.app.modules[mod.name] = mod;
                        sails.emit('modules:' + mod.name + ':init');
                        mod.log.verbose('Finished initializing.');
                        return mod;
                    }).then(ModuleService.registerCustomModels)
                    .then(ModuleService.registerCustomControllers)
                    .then(ModuleService.registerCustomRoutes).catch(function(err) {
                        sails.log.error("Error initializing: " + err.message);
                    });
                }, { concurrency: 3 }).then(function(initializedModules) {
                    sails.emit('hook:moduleloader:modulesinit');
                    sails.log.verbose('Initialized all modules.');
                    sails.emit('hook:moduleloader:custommodels');
                    return _.filter(initializedModules);
                });
        },
        enableAll: function() {
            return Promise.map(this.loadedModules, _enable).then(function() {
                sails.emit('hook:modulesloader:modulesenable');
                sails.log.info('Loaded all modules.');
            });
        },
        enable: function(name) {
            var mod = _.find(this.loadedModules, function(mod) { return mod.name === name; });
            if(mod)
                return _enable(mod);
        },

        disable: function(name) {
            var mod = _.find(this.loadedModules, function(mod) { return mod.name === name; });
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
