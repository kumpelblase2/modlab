var Plugin = require('modlab-plugin');
var util = require('util');

function Commands(app, chat)
{
    Commands.super_.call(this, app, chat, {
        name: "commands",
        version: "0.0.1",
        models: { 'Command': require('./command') }
    });
}

util.inherits(Commands, Plugin);

Commands.prototype.enable = function(callback) {
    var self = this;
    Command.find().exec(function(err, commands) {
        if(commands) {
            commands.forEach(function(command) {
                switch(command.type) {
                    case 'hear':
                        self.chat.hear(new RegExp(command.data.regex), function(message) {
                            message.reply(command.data.message);
                        });
                        break;

                    case 'basic':
                        self.registerCommand(command.name, command.data.message);
                        break;
                }
            });
        }
        callback();
    });
};

Commands.prototype.registerCommand = function(name, callback) {
    self.chat.hear(new RegExp("$" + sails.config.plugin.commands.prefix + name), function(message) {
        //TODO
    });
};

Commands.prototype.disable = function() {

};

module.exports = function (app, chat) {
    return new Commands(app, chat);
};
