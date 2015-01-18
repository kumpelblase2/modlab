var _ = require('lodash');

function App() {
    this.customModels = [];
    this.customControllers = [];
    this.plugins = {};
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

App.prototype.registerControllers = function(controllers) {
    var self = this;
    _.forOwn(controllers, function(controller, name) {
        self.customControllers.push({
            name: name,
            controller: controller
        });
        controller.globalId = name;
        controller.identity = name.toLowerCase();
        PluginService.registerControllerInSails(name.toLowerCase(), controller);
    });
};

App.prototype.finishedInstallation = function() {
    return this.installation.value.finished;
}

App.prototype.currentInstallationStep = function() {
    return this.installation.value.step;
}

module.exports = App;
