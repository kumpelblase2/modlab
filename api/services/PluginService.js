var path = require('path');
var captains = require('sails/node_modules/captains-log');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
    generateDefaultConfig: function(plugin, confDir) {
        confDir = confDir || path.join(sails.config.paths.config, 'plugin');
        var defaults = plugin.defaults || {};
        sails.config.plugin[plugin.name] = defaults;
        return PluginService.writePluginConfig(defaults, plugin, confDir);
    },
    writePluginConfig: function(config, plugin, confDir) {
        return Promise.resolve().then(function() {
            return JSON.stringify(config, null, 4);
        }).then(function(parsed) {
            var configPath = path.join(confDir, plugin.name + '.json');
            return fs.writeFile(configPath, parsed);
        }).then(function() {
            plugin.log.info('Generated default config.');
        }).catch(function(err) {
            plugin.log.error('Could not save default config: ' + err);
        });
    },
    registerCustomModels: function(plugin) {
        if(plugin.models) {
            sails.app.registerModels(plugin.models);
            sails.emit('plugin:' + plugin.name + ':models');
            plugin.log.verbose('Added ' + plugin.models.length + ' custom model(s).');
        }
    },
    createPluginLogger: function(pluginname) {
        var customOptions = _.clone(sails.config.log);
        var themeName = 'plugin_' + pluginname;
        customOptions.prefixThemes = {};
        customOptions.prefixThemes[themeName] = {
            silly: 'silly [' + pluginname + ']: ',
            verbose: 'verbose [' + pluginname + ']: ',
            info: 'info [' + pluginname + ']: ',
            blank: '[' + pluginname + ']: ',
            debug: 'debug [' + pluginname + ']: ',
            warn: 'warn [' + pluginname + ']: ',
            error: 'error [' + pluginname + ']: ',
            crit: 'CRITICAL [' + pluginname + ']: '
        };
        customOptions.prefixTheme = themeName;
        return captains(customOptions);
    }
};
