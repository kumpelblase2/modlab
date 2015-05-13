var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

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
    },
    create: function(mod) {
        var moduleMain;
        if(mod.source === 'npm') {
            moduleMain = require(mod.name);
        } else if(mod.source === 'local') {
            moduleMain = require(path.join(sails.config.rootPath, mod.path));
        }

        var result = Promise.promisifyAll(moduleMain(sails.app, sails.chat));
        if(!result.name)
            result.name = mod.name;

        result.path = (mod.source === 'npm' ? path.join(sails.config.rootPath, 'node_modules', mod.name) : path.join(sails.config.rootPath, mod.path));
        result.relPath = (mod.source === 'npm' ? path.join('.', 'node_moodules', mod.name) : path.join('.', mod.path));
        result.log = ModuleService.createModuleLogger(result.name);
        result.displayName = result.name.charAt(0).toUpperCase() + result.name.slice(1);
        result.assetDirectory = result.assetDirectory || path.join(result.relPath, 'assets');
        sails.emit('module:' + result.name + ':loaded');
        return result;
    }
};
