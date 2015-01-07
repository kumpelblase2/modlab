var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = {
    filter: function(plugins) {
        var toLoad = [];
        _.forOwn(plugins, function(options, name) {
            if(!options)
                return;

            if(options === true) {
                toLoad.push({
                    name: name,
                    source: 'npm'
                });
            } else if(typeof(options) === "object") {
                if(options.disabled)
                    return;

                var source = options.path ? 'local' : 'npm';
                toLoad.push(_.merge({ source: source, name: name }, options, function(a, b) { return b ? b : a; }));
            }
        });

        return toLoad;
    },
    enable: function(plugin, callback) {
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
    },
    disable: function(plugin) {
        plugin.disable();
        sails.emit('plugin:' + plugin.name + ':disable');
        sails.log.info('Disabled plugin `' + plugin.name + '`.');
    }
};
