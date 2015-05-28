var _ = require('lodash');

function App() {
    this.customModels = [];
    this.customControllers = [];
    this.modules = {};
    this.customPages = [];
    this.customWidgets = [];
    this.moduleMenus = {};
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
        module: mod,
        controller: widget.controller,
        action: widget.action
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

App.prototype.registerMenuItem = function(mod, info) {
    var permission = '';
    var url = '';
    var defaultURI = ModuleService.getModuleURI(mod);

    if(typeof(info) == 'undefined') {
        url = defaultURI;
    } else if(typeof(info) == 'string') {
        url = info;
    } else if(typeof(info) == 'object') {
        permission = info.permission || '';
        url = info.url || defaultURI;
    } else {
        sails.log.warning('Could not register menu for ' + mod.name + '. No proper url provided.');
        return;
    }

    if(!this.moduleMenus[mod.name]) {
        this.moduleMenus[mod.name] = {
            display: mod.displayName,
            items: []
        };
    }

    this.moduleMenus[mod.name].items.push({
        permission: permission,
        url: url,
        text: mod.displayName
    });
};

App.prototype.finishedInstallation = function() {
    return this.installation.value.finished;
};

App.prototype.currentInstallationStep = function() {
    return this.installation.value.step;
};

module.exports = App;
