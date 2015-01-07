var path = require('path');
var helper = require('./pluginhelper');
var filter = helper.filter;
var loadPluginConfig = helper.loadConfig;

var _disable = function(plugin) {
    plugin.disable();
    sails.emit('plugin:' + plugin.name + ':disable');
    sails.log.info('Disabled plugin `' + plugin.name + '`.');
}

var _enable = function(plugin, callback) {
    var logCallback = function(error) {
        if(error) {
            callback(error);
        } else {
            sails.emit('plugin:' + plugin.name + ':enabled');
            sails.log.info('Enabled plugin `' + plugin.name + '`.');
            callback();
        }
    }
    plugin.enable(logCallback);
};

module.exports = function(sails) {
    return {
        loadedPlugins: [],

        initialize: function(cb) {
            var self = this;
            var waitFor = ['hook:app:loaded', 'hook:chat:loaded'];
            sails.after(waitFor, function() {
                var plugins = filter(sails.config.plugins);
                var waiting = [];
                plugins.forEach(function(plugin) {
                    waiting.push(function(callback) {
                        sails.log.info('Loading plugin with id `' + plugin.name + '` ...');
                        var pluginMain;
                        if(plugin.source === 'npm') {
                            pluginMain = require(plugin.name);
                        } else if(plugin.source === 'local') {
                            pluginMain = require(path.join(sails.config.rootPath, plugin.path));
                        }

                        var result = pluginMain(sails.app, sails.chat);
                        if(!result.name)
                            result.name = plugin.name;

                        self.loadedPlugins.push(result);
                        var logCallback = function() {
                            sails.emit('plugin:' + plugin.name + ':init');
                            sails.log.verbose('Finished initializing `' + plugin.name + '`.');
                            callback(null, result);
                        };

                        var config = loadPluginConfig(plugin.name);
                        result.init(config, logCallback);
                    });
                });

                var done = cb;
                async.series([
                    function(cb) {
                        async.parallel(waiting, function(err, result) {
                            if(err)
                                sails.log.error(err);

                            sails.emit('hook:pluginloader:pluginsinit');
                            sails.log.verbose('Initialized all plugins.');
                            cb(null, result);
                        });
                    },
                    function(cb) {
                        async.each(self.loadedPlugins, _enable, cb);
                    }
                ], done);
            });
        },
        enable: function(name) {
            var plugin = _.find(this.loadedPlugins, function(plugin) { plugin.name === name });
            if(plugin)
                _enable(plugin);
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
