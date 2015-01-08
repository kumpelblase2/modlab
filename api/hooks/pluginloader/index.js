var path = require('path');
var helper = require('./pluginhelper');
var Promise = require('bluebird');
var filter = helper.filter;

var _disable = helper.disable;
var _enable = helper.enable;

module.exports = function(sails) {
    return {
        loadedPlugins: [],

        initialize: function(cb) {
            var self = this;
            var waitFor = ['hook:app:loaded', 'hook:chat:loaded', 'hook:pluginconfig:loaded'];
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

                    return Promise.resolve().then(function() {
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
                        sails.log.verbose('Finished initializing `' + plugin.name + '`.');
                        if(plugin.models && Array.isArray(plugin.models) && plugin.models.length > 0) {
                            sails.app.registerModels(plugin.models);
                            sails.emit('plugin:' + plugin.name + ':models');
                            sails.log.verbose('Added ' + plugin.models.length + ' custom model(s) for plugin `' + plugin.name + '`.');
                        }
                        return plugin;
                    }).catch(function(err) {
                        sails.log.error("Error initializing " + result.name + ": " + err.message);
                    });
                }, { concurrency: 5 }).then(function(initializedPlugins) {
                    sails.emit('hook:pluginloader:pluginsinit');
                    sails.log.verbose('Initialized all plugins.');
                    var initialized = _.filter(initializedPlugins);
                    initialized.forEach(function(plugin) {
                            sails.app.registerModels(plugin.models);
                    });
                    sails.emit('hook:pluginloader:custommodels');
                    return initialized;
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
