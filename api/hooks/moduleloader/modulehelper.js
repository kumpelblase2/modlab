var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = {
    filter: function(modules) {
        var toLoad = [];
        _.forOwn(modules, function(options, name) {
            if(!options)
                return;

            if(options === true) {
                toLoad.push({
                    name: name,
                    source: 'npm',
                    path: path.join('node_modules', name)
                });
            } else if(typeof(options) === "object") {
                if(options.disabled)
                    return;

                var source = options.path ? 'local' : 'npm';
                var plPath = options.path || path.join('node_modules', name);
                toLoad.push(_.merge({ source: source, name: name, path: plPath }, options, function(a, b) { return b ? b : a; }));
            }
        });

        return toLoad;
    },
    enable: function(mod) {
        return mod.enableAsync().then(function() {
            mod.enabled = true;
            sails.emit('module:' + mod.name + ':enabled');
            mod.log.info('Enabled module `' + mod.name + '` at version ' + mod.version + '.');
        }).catch(function(err) {
            mod.log.error("Couldn't enable: " + err.message);
        });
    },
    disable: function(mod) {
        return new Promise(function(resolve, reject) {
            mod.disable();
            mod.enabled = false;
            sails.emit('module:' + mod.name + ':disable');
            mod.log.info('Disabled module `' + mod.name + '`.');
            resolve(mod);
        });
    }
};
