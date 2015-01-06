var async = require('async');
var Waterline = require('waterline');

module.exports = function(sails) {
    return {
        initialize: function(cb) {
            sails.log.info('loaded custom models');
            var loadmodels = require('./load-user-modules')(sails);
            var customModels = sails.app.customModels;
            async.auto({
                _loadModules: loadmodels,
                modelDefs: ['_loadModules', function(next){
                    _.each(customModels, function(aditionModel) {
                        _.merge(sails.models, additionalModel);
                    });

                    _.each(sails.models, sails.hooks.orm.normalizeModelDef);
                    next(null, sails.models);
                }],

                // 4. Load models into waterline, 5. tear down connections, 6. reinitialize waterline
                instantiatedCollections: ['modelDefs', function(next, stack) {
                    var modelDefs = stack.modelDefs;

                    var waterline = new Waterline();
                    _.each(modelDefs, function(modelDef, modelID){
                        waterline.loadCollection(Waterline.Collection.extend(modelDef));
                    });

                    var connections = {};

                    _.each(sails.adapters, function(adapter, adapterKey) {
                        _.each(sails.config.connections, function(connection, connectionKey) {
                            if (adapterKey !== connection.adapter) return;
                            connections[connectionKey] = connection;
                        });
                    });

                    var toTearDown = [];

                    _.each(connections, function(connection, connectionKey) {
                        toTearDown.push({ adapter: connection.adapter, connection: connectionKey });
                    });

                    async.each(toTearDown, function(tear, callback) {
                        sails.adapters[tear.adapter].teardown(tear.connection, callback);
                    }, function(){
                        waterline.initialize({
                            adapters: sails.adapters,
                            connections: connections
                        }, next)
                    });
                }],

                // 7. Expose initialized models to global scope and sails
                _prepareModels: ['instantiatedCollections', sails.hooks.orm.prepareModels],
                end: ['_prepareModels', function(next) { cb(); }]
            });
        }
    };
};
