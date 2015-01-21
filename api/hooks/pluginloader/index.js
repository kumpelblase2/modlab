var path = require('path');
var helper = require('./pluginhelper');
var Promise = require('bluebird');
var filter = helper.filter;
var fs = Promise.promisifyAll(require('fs'));

var _disable = helper.disable;
var _enable = helper.enable;

module.exports = function(sails) {
    return {
        loadedPlugins: [],

        initialize: function(cb) {
            if(!sails.config.rootPath) {
                sails.config.rootPath = path.join(sails.config.paths.config, '..');
            }

            if(!sails.config.plugin) {
                sails.config.plugin = {};
            }

            var self = this;
            var waitFor = ['hook:app:loaded', 'hook:chat:loaded'];
            var plugins = filter(sails.config.plugins);
            var waiting = [];
            sails.afterAsync(waitFor).then(function() {
                return Promise.map(plugins, function(pluginInfo) {
                    sails.log.info('Loading plugin with id `' + pluginInfo.name + '` ...');
                    var pluginMain;
                    if(pluginInfo.source === 'npm') {
                        pluginMain = require(pluginInfo.name);
                    } else if(pluginInfo.source === 'local') {
                        pluginMain = require(path.join(sails.config.rootPath, pluginInfo.path));
                    }

                    var result = Promise.promisifyAll(pluginMain(sails.app, sails.chat));
                    if(!result.name)
                        result.name = pluginInfo.name;

                    result.path = (pluginInfo.source === 'npm' ? path.join(sails.config.rootPath, 'node_modules', pluginInfo.name) : path.join(sails.config.rootPath, pluginInfo.path));
                    result.relPath = (pluginInfo.source === 'npm' ? path.join('.', 'node_moodules', pluginInfo.name) : path.join('.', pluginInfo.path));
                    result.log = PluginService.createPluginLogger(result.name);
                    return Promise.resolve().then(function() {
                        /*if(!_.has(sails.config.plugin, result.name)) {
                            return PluginService.generateDefaultConfig(result);
                        }*/
                    }).then(function() {
                        if(typeof(result.init) === "function") {
                            return result.initAsync().then(function() {
                                self.loadedPlugins.push(result);
                                return result;
                            });
                        } else {
                            self.loadedPlugins.push(result);
                            return result;
                        }
                    }).then(function(plugin) {
                        plugin.loaded = true;
                        sails.app.plugins[plugin.name] = plugin;
                        sails.emit('plugin:' + plugin.name + ':init');
                        plugin.log.verbose('Finished initializing.');
                        PluginService.registerCustomModels(plugin);
                        PluginService.registerCustomControllers(plugin);
                        PluginService.registerCustomRoutes(plugin);
                        return plugin;
                    }).catch(function(err) {
                        result.log.error("Error initializing: " + err.message);
                    });
                }, { concurrency: 5 }).then(function(initializedPlugins) {
                    sails.emit('hook:pluginloader:pluginsinit');
                    sails.log.verbose('Initialized all plugins.');
                    sails.emit('hook:pluginloader:custommodels');
                    return _.filter(initializedPlugins);
                });
            }).then(function(initialized) {
                cb(null, initialized);
            }).catch(function(err) {
                sails.log.error(err);
                cb();
            });
        },
        enableAll: function() {
            return Promise.map(this.loadedPlugins, _enable).then(function() {
                sails.emit('hook:pluginloader:pluginsenable');
                sails.log.info('Loaded all plugins.');
            });
        },
        enable: function(name) {
            var plugin = _.find(this.loadedPlugins, function(plugin) { plugin.name === name });
            if(plugin)
                return _enable(plugin);
        },

        disablePlugin: function(name) {
            var plugin = _.find(this.loadedPlugins, function(plugin) { plugin.name === name });
            if(plugin)
                _disable(plugin);
        },
        disableAll: function() {
            this.loadedPlugins.forEach(_disable);
        },

        teardown: function(cb) {
            this.disableAll();
        }
    };
};
