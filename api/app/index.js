var _ = require('lodash');

function App() {
    this.customModels = [];
    this.plugins = {};
    this.installation = { step: 0, finished: false };
}

App.prototype.registerSite = function() {

};

App.prototype.registerWidget = function() {

};

App.prototype.registerModels = function(models) {
    var self = this;
    _.forOwn(models, function(schema, name) {
        self.customModels.push({
            name: name,
            schema: schema
        });
        schema.globalId = name;
        sails.models[name.toLowerCase()] = schema;
    });
};

App.prototype.finishedInstallation = function() {
    return this.installation.finished;
}

module.exports = App;
