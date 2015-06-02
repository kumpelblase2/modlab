var _ = require('lodash');

function App() {
    this.customModels = [];
    this.customControllers = [];
    this.modules = {};
    this.customPages = [];
    this.customWidgets = [];
}

App.prototype.registerSite = function(mod, page) {
    this.customPages.push({
        module: mod,
        name: mod.name,
        route: mod.path,
        requires: mod.requirements
    });
};

App.prototype.registerWidget = function(mod, widget) {
    this.customWidgets.push({
        id: widget.controller + '#' + widget.action,
        module: mod,
        controller: widget.controller,
        action: widget.action,
        permission: widget.permission || ''
    });
};

App.prototype.registerModels = function(mod, models) {
    var self = this;
    _.forOwn(models, function(schema, name) {
        self.customModels.push({
            name: name,
            schema: schema,
            module: mod
        });
        schema.globalId = name;
        schema.identity = name.toLowerCase();
        schema.schema = true;
        schema.connection = sails.config.models.connection;
        sails.models[schema.identity] = schema;
    });
};

App.prototype.registerControllers = function(mod, controllers) {
    var self = this;
    _.forOwn(controllers, function(controller, name) {
        var newName = mod.displayName.replace(/\-/g, '') + name;
        self.customControllers.push({
            name: newName,
            controller: controller,
            module: mod
        });
        controller.globalId = newName;
        controller.identity = newName.toLowerCase();
        ModuleService.registerControllerInSails(newName.toLowerCase(), controller);
    });
};

App.prototype.finishedInstallation = function() {
    return this.installation.value.finished;
};

App.prototype.currentInstallationStep = function() {
    return this.installation.value.step;
};

module.exports = App;
