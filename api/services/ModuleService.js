var path = require('path');
var captains = require('sails/node_modules/captains-log');
var Promise = require('bluebird');
var fs = require('fs');
var _ = require('lodash');
var tsort = require('tsort');

module.exports = {
    generateDefaultConfig: function(mod, confDir) {
        confDir = confDir || path.join(sails.config.paths.config, 'modules');
        var defaults = mod.defaults || {};
        sails.config.moduleconfig[mod.name] = defaults;
        return ModuleService.writeModuleConfig(defaults, mod, confDir);
    },
    writeModuleConfig: function(config, mod, confDir) {
        return Promise.resolve().then(function() {
            var tempConfig = { 'moduleconfig': {} };
            tempConfig.moduleconfig[mod.name] = config;
            return JSON.stringify(tempConfig, null, 4);
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
            mod.log.verbose('Added ' + Object.keys(mod.models).length + ' custom model(s).');
        }

        return mod;
    },
    registerCustomControllers: function(mod) {
        if(mod.controllers) {
            sails.app.registerControllers(mod, mod.controllers);
            sails.emit('module:' + mod.name + ':controllers');
            mod.log.verbose('Added ' + Object.keys(mod.controllers).length + ' custom controllers(s).');
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

                if(typeof(routeInfo) == 'object') {
                    if("requiresLogin" in routeInfo && !routeInfo.requiresLogin) {
                        ModuleService.registerInsecureRoute(mod, routeInfo.value);
                    }

                    sails.config.routes[routeName] = routeInfo.value;
                } else {
                    sails.config.routes[routeName] = routeInfo;
                }

                sails.router.explicitRoutes = sails.config.routes;
            });
        }
        return mod;
    },

    registerControllerInSails: function(id, controller) {
        controller.sails = sails;
        sails.controllers[id] = controller;
        var hook = sails.hooks.controllers;

        if (!(_.isObject(hook.middleware[id]) && !_.isArray(hook.middleware[id]) && !_.isFunction(hook.middleware[id]))) {
            hook.middleware[id] = {};
        }

        _.bindAll(controller);
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

    registerInsecureRoute: function(module, controller) {
        if(controller.indexOf('/') >= 0 || controller.indexOf('.') < 0) {
            sails.log.warning('Could not register an insecure route because target was not a controller.');
            return;
        }

        var controllerSplit = controller.split('.');
        var controllerName = controllerSplit[0];
        var action = controllerSplit[1];
        var object = sails.hooks.policies.mapping[controllerName];
        var newPolicies = sails.hooks.policies.mapping['*'].slice();
        _.remove(newPolicies, function(elem) {
            return elem.identity == 'sessionauth';
        });

        if(!object) {
            object = {};
        }

        object[action] = newPolicies;
        var controllerNameInPolicies = controllerName.toLowerCase().replace(/controller$/, '');
        sails.hooks.policies.mapping[controllerNameInPolicies] = object;
        console.dir(sails.hooks.policies.mapping[controllerName]);
        console.dir(sails.hooks.policies.mapping);
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
    },

    sortModulesForLoading: function(modules) {
        var dependencyGraph = tsort();

        modules.forEach(function(module) {
            if(!module.dependencies || module.dependencies.length == 0) {
                dependencyGraph.add('0', module.name);
            } else {
                module.dependencies.forEach(function (dep) {
                    dependencyGraph.add(dep, module.name);
                });
            }
        });

        var sorted = dependencyGraph.sort();
        if(sorted[0] == '0') {
            sorted.shift();
        }

        var result = [];
        sorted.forEach(function(name) {
            result.push(_.find(modules, function(mod) { return mod.name == name; }));
        });

        return result;
    }
};
