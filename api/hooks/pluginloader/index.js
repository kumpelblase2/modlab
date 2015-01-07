var path = require('path');

module.exports = function(sails) {
    return {
        initialize: function(cb) {
            sails.after('hook:app:loaded', function() {
                var plugins = sails.config.plugins;
                var waiting = [];
                var pluginNames = Object.keys(plugins);
                pluginNames.forEach(function(plugin) {
                    waiting.push(function(callback) {
                        sails.log.info('Loading plugin ' + plugin + ' ...');
                        var pluginInfo = plugins[plugin];
                        var pluginMain;
                        if (pluginInfo.path) {
                            pluginMain = require(path.join(sails.config.rootPath, pluginInfo.path));
                        } else {
                            pluginMain = require(pluginInfo.name);
                        }

                        var logCallback = function() {
                            sails.log.info('Finished loading ' + plugin + '.');
                            callback();
                        };

                        pluginMain(sails.chat, sails.app, logCallback);
                    });
                });

                async.parallel(waiting, function(err, result) {
                    if(err)
                        sails.log.error(err);

                    sails.log.info('Loaded ' + pluginNames.length + ' plugin(s).');
                    sails.log.info('Connecting to chat ...');
                    sails.chat.run();
                    cb();
                });
            });
        }
    };
};
