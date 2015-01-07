var path = require('path');
var filter = require('./pluginhelper');

module.exports = function(sails) {
    return {
        loadedPlugins: [],

        initialize: function(cb) {
            var self = this;
            sails.after('hook:app:loaded', function() {
                var plugins = filter(sails.config.plugins);
                var waiting = [];
                plugins.forEach(function(plugin) {
                    waiting.push(function(callback) {
                        sails.log.info('Loading plugin `' + plugin.name + '`` ...');
                        var pluginMain;
                        if(plugin.source === 'npm') {
                            pluginMain = require(plugin.name);
                        } else if(plugin.source === 'local') {
                            pluginMain = require(path.join(sails.config.rootPath, plugin.path));
                        }

                        var logCallback = function() {
                            self.loadedPlugins.push(plugin);
                            sails.emit('plugin:' + plugin.name + ':loaded');
                            sails.log.info('Finished loading `' + plugin.name + '`.');
                            callback();
                        };

                        sails.emit('plugin:' + plugin.name + ':init');
                        pluginMain(sails.chat, sails.app, logCallback);
                    });
                });

                async.parallel(waiting, function(err, result) {
                    if(err)
                        sails.log.error(err);

                    sails.log.info('Loaded ' + self.loadedPlugins.length + ' plugin(s).');
                    if(!sails.config.chat.disabled) {
                        sails.log.info('Connecting to chat ...');
                        sails.chat.run();
                    } else {
                        sails.log.info('Chat is disabled.');
                    }
                    cb();
                });
            });
        }
    };
};
