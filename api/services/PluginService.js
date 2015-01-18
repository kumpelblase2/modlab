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
            sails.app.registerModels(plugin, plugin.models);
            sails.emit('plugin:' + plugin.name + ':models');
            plugin.log.verbose('Added ' + plugin.models.length + ' custom model(s).');
        }
    },
    registerCustomControllers: function(plugin) {
        if(plugin.controllers) {
            sails.app.registerControllers(plugin, plugin.controllers);
            sails.emit('plugin:' + plugin.name + ':controllers');
            plugin.log.verbose('Added ' + plugin.controllers.length + ' custom controllers(s).');
        }
    },
    registerCustomRoutes: function(plugin) {
        if(plugin.routes) {
            var routes = plugin.routes;
            _.forOwn(routes, function(routeInfo, routeName) {
                var split = routeName.split(' ');
                var verb = '';
                var action;
                if(split.length > 1) {
                    if(split[0].charAt(0) !== 'r') {
                        verb = split[0];
                        action = split.splice(1).join(' ');
                    } else {
                        action = split.join(' ');
                    }
                } else {
                    action = split[0];
                }

                if(action.charAt(0) === '/') {
                    routeName = verb + ' /p/' + plugin.name.toLowerCase() + action;
                } else if(action.charAt(0) === 'r') {
                    var regex = action.slice(2);
                    if(regex.charAt(0) === '^') {
                        routeName = verb + ' r|^/p/' + plugin.name.toLowerCase() + regex.slice(1);
                    } else {
                        routeName = verb + ' r|/p/' + plugin.name.toLowerCase() + regex;
                    }
                } else {
                    sails.log.error(new Error('Invlid route detected: ' + routeName));
                }

                sails.config.routes[routeName] = routeInfo;
            });
        }
    },

    registerControllerInSails: function(id, controller) {
        sails.controllers[id] = controller;
        var hook = sails.hooks.controllers;

        if (!(_.isObject(hook.middleware[id]) && !_.isArray(hook.middleware[id]) && !_.isFunction(hook.middleware[id]))) {
            hook.middleware[id] = {};
        }

        _.each(controller, function(action, actionId) {
            actionId = actionId.toLowerCase();

            if (action === false) {
                delete hook.middleware[id][actionId];
                return;
            }

            if (_.isString(action) || _.isBoolean(action)) {
                return;
            }

            action._middlewareType = 'ACTION: '+id+'/'+actionId;
            hook.middleware[id][actionId] = action;
            hook.explicitActions[id] = hook.explicitActions[id] || {};
            hook.explicitActions[id][actionId] = true;
        });
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
