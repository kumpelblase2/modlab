var Plugin = require('modlab-plugin');
var util = require('util');

function SystemInfo(app, chat)
{
    SystemInfo.super_.call(this, app, chat, {
        name: "system-info",
        version: "0.0.1"
    });

    this.widgets = [{
        controller: 'SysteminfoWidget',
        action: 'modules',
        permission: 'system.modules.view'
    }, {
        controller: 'SysteminfoWidget',
        action: 'users',
        permission: 'system.rights.view'
    }, {
        controller: 'SysteminfoWidget',
        action: 'groups',
        permission: 'system.rights.view'
    }];

    this.controllers = {
        'Widget': require('./WidgetController')
    }
}

util.inherits(SystemInfo, Plugin);

SystemInfo.prototype.enable = function(callback) {
    var self = this;
    this.widgets.forEach(function(widget) {
        sails.app.registerWidget(self, widget);
    });
    callback();
};

module.exports = function (app, chat) {
    return new SystemInfo(app, chat);
};
