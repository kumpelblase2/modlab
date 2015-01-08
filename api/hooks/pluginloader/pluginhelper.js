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
    enable: function(plugin) {
        return plugin.enableAsync().then(function() {
            plugin.enabled = true;
            sails.emit('plugin:' + plugin.name + ':enabled');
            sails.log.info('Enabled plugin `' + plugin.name + '`.');
        }).catch(function(err) {
            sails.log.error("Couldn't initialize " + plugin.name + ": " + err.message);
        });
    },
    disable: function(plugin) {
        return new Promise(function(resolve, reject) {
            plugin.disable();
            plugin.enabled = false;
            sails.emit('plugin:' + plugin.name + ':disable');
            sails.log.info('Disabled plugin `' + plugin.name + '`.');
            resolve(plugin);
        });
    }
};
