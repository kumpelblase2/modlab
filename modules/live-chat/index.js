var Plugin = require('modlab-plugin');
var util = require('util');

function LiveChat(app, chat) {
    LiveChat.super_.call(this, app, chat, {
        name: "live-chat",
        version: "0.0.1"
    });

    this.author = 'kumpelblase2';
    this.description = 'Live chat widget';

    this.liveChat = {
        controller: 'LivechatChat',
        action: 'module'
    };

    this.controllers = {
        'Chat': require('./LiveChatController')
    };

    this.routes = {
        'GET /': 'LivechatChatController.index'
    };
}

util.inherits(LiveChat, Plugin);

LiveChat.prototype.enable = function(callback) {
    sails.app.registerWidget(this, this.liveChat);
    sails.app.registerMenuItem(this, { permission: 'module.livechat.view' });
    callback();
};

module.exports = function (app, chat) {
    return new LiveChat(app, chat);
};
