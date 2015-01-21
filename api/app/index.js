var _ = require('lodash');

function App() {
    this.customModels = [];
    this.customControllers = [];
    this.plugins = {};
    this.customPages = [];
    this.customWidgets = [];
}

App.prototype.registerSite = function(plugin, page) {
    this.customPages.push({
        plugin: plugin,
        name: page.name,
        route: page.path,
        requires: page.requirements
    });
};

App.prototype.registerWidget = function(plugin, widget) {
    this.customWidgets.push({
        plugin: plugin,
        controller: plugin.displayName + widget.controller,
        action: widget.action
    });
};

App.prototype.registerModels = function(plugin, models) {
    var self = this;
    _.forOwn(models, function(schema, name) {
        self.customModels.push({
            name: name,
            schema: schema,
            plugin: plugin
        });
        schema.globalId = name;
        sails.models[name.toLowerCase()] = schema;
    });
};

App.prototype.registerControllers = function(plugin, controllers) {
    var self = this;
    _.forOwn(controllers, function(controller, name) {
        var newName = plugin.displayName + name;
        self.customControllers.push({
            name: newName,
            controller: controller,
            plugin: plugin
        });
        controller.globalId = newName;
        controller.identity = newName.toLowerCase();
        PluginService.registerControllerInSails(newName.toLowerCase(), controller);
    });
};

App.prototype.finishedInstallation = function() {
    return this.installation.value.finished;
}

App.prototype.currentInstallationStep = function() {
    return this.installation.value.step;
}

module.exports = App;
