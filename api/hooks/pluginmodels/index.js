module.exports = function(sails) {
    return {
        initialize: function(cb) {
            sails.after('hook:app:loaded', function() {
                sails.log.verbose('Loading custom plugin models...');
                sails.app.customModels.forEach(function(model) {
                    sails.models[model.name] = model.shema;
                });
                cb();
            });
        }
    };
};
