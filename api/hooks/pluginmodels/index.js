module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var waitFor = ['hook:app:loaded', 'hook:pluginloaded:loaded'];
            sails.after(waitFor, function() {
                sails.log.verbose('Loading custom plugin models...');
                sails.app.customModels.forEach(function(model) {
                    sails.models[model.name] = model.shema;
                });
                cb();
            });
        }
    };
};
