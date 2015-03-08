var path = require('path');
var captains = require('sails/node_modules/captains-log');
var Promise = require('bluebird');
var fs = require('fs');

module.exports = {
    generateDefaultConfig: function(mod, confDir) {
        confDir = confDir || path.join(sails.config.paths.config, 'modules');
        var defaults = mod.defaults || {};
        sails.config.modules[mod.name] = defaults;
        return ModuleService.writeModuleConfig(defaults, mod, confDir);
    },
    writeModuleConfig: function(config, mod, confDir) {
        return Promise.resolve().then(function() {
            return JSON.stringify(config, null, 4);
        }).then(function(parsed) {
            var configPath = path.join(confDir, mod.name + '.json');
            return fs.writeFile(configPath, parsed);
        }).then(function() {
            mod.log.info('Generated default config.');
            return mod;
        }).catch(function(err) {
            mod.log.error('Could not save default config: ' + err);
        });
    },
    registerCustomModels: function(mod) {
        if(mod.models) {
            sails.app.registerModels(mod, mod.models);
            sails.emit('module:' + mod.name + ':models');
            mod.log.verbose('Added ' + mod.models.length + ' custom model(s).');
        }

        return mod;
    },
    registerCustomControllers: function(mod) {
        if(mod.controllers) {
            sails.app.registerControllers(mod, mod.controllers);
            sails.emit('module:' + mod.name + ':controllers');
            mod.log.verbose('Added ' + mod.controllers.length + ' custom controllers(s).');
        }

        return mod;
    },
    registerCustomRoutes: function(mod) {
        if(mod.routes) {
            var routes = mod.routes;
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
                    routeName = verb + ' /m/' + mod.name.toLowerCase() + action;
                } else if(action.charAt(0) === 'r') {
                    var regex = action.slice(2);
                    if(regex.charAt(0) === '^') {
                        routeName = verb + ' r|^/m/' + mod.name.toLowerCase() + regex.slice(1);
                    } else {
                        routeName = verb + ' r|/m/' + mod.name.toLowerCase() + regex;
                    }
                } else {
                    sails.log.error(new Error('Invlid route detected: ' + routeName));
                }

                sails.config.routes[routeName] = routeInfo;
            });
        }

        return mod;
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

    renderWidgets: function(widgets, req, res) {
        var widgetContents = [];

        widgets.forEach(function(widget) {
            var controller = widget.controller.toLowerCase();
            var action = widget.action;
            var result = sails.controllers[controller][action](req);
            if(result) {
                result.owner = widget;
                widgetContents.push(result);
            }
        });

        return widgetContents;
    },

    createModuleLogger: function(modulename) {
        var customOptions = _.clone(sails.config.log);
        var themeName = 'module_' + modulename;
        customOptions.prefixThemes = {};
        customOptions.prefixThemes[themeName] = {
            silly: 'silly [' + modulename + ']: ',
            verbose: 'verbose [' + modulename + ']: ',
            info: 'info [' + modulename + ']: ',
            blank: '[' + modulename + ']: ',
            debug: 'debug [' + modulename + ']: ',
            warn: 'warn [' + modulename + ']: ',
            error: 'error [' + modulename + ']: ',
            crit: 'CRITICAL [' + modulename + ']: '
        };
        customOptions.prefixTheme = themeName;
        return captains(customOptions);
    }
};
