var Plugin = require('modlab-plugin');
var util = require('util');
var messageFormatter = require('./CommandFormatter');

function Commands(app, chat)
{
    Commands.super_.call(this, app, chat, {
        name: 'commands',
        version: '0.0.1',
        models: { 'Command': require('./models/command') }
    });

    this.description = 'Basic command plugin';
    this.author = 'kumpelblase2';

    this.controllers = {
        'Command': require('./controllers/CommandController')
    };

    this.routes = {
        'GET /': 'CommandsCommandController.index',
        'POST /command': 'CommandsCommandController.create',
        'POST /command/:id': 'CommandsCommandController.update',
        'GET /command/:id/edit': 'CommandsCommandController.edit',
        'DELETE /command/:id': 'CommandsCommandController.deleteC',
        'GET /command/new': 'CommandsCommandController.prepareNew'
    };
}

util.inherits(Commands, Plugin);
Commands.prototype.enable = function(callback) {
    var self = this;
    self.app.registerMenuItem(self, { permission: 'module.commands.view' });

    Command.find().exec(function(err, commands) {
        if(commands) {
            commands.forEach(function(command) {
                switch(command.type) {
                    case 'hear':
                        self.registerHearingCommand(command.data.regex, simpleChannelMessage(command.data.message));
                        break;

                    case 'basic':
                        self.registerCommand(command.name, simpleMessage(command.data.message));
                        break;
                }
            });
        }
        callback();
    });

    messageFormatter.formatters = sails.config.moduleconfig.commands.formatters;

    self.registerCommand('register', function(args, message) {
        var command = UtilityService.escapeRegex(args[0]);
        var content = args.slice(1).join(' ');
        Command.create({
            name: command,
            type: 'basic',
            data: { message: content }
        }, function(err) {
            if(err) {
                message.reply('Could not register command');
            } else {
                message.reply('Added command ' + command);
                self.registerCommand(command, simpleMessage(content));
            }
        });
    });

    self.registerCommand('hear', function(args, message) {
        var name = UtilityService.escapeRegex(args[0]);
        var regex = "^[^" + sails.config.moduleconfig.commands.prefix + "]" + args[1];
        var content = args.slice(2).join(' ');
        Command.create({
            name: name,
            type: 'hear',
            data: { regex: regex, message: content }
        }, function(err) {
            if(err) {
                message.reply('Could not register hearing command');
            } else {
                message.reply('Added hearing command ' + name);
                self.registerHearingCommand(regex, simpleChannelMessage(content));
            }
        });
    });
};

Commands.prototype.registerCommand = function(name, callback) {
    //TODO change regex to a single regex handler that calls the commands via name
    this.chat.hear(new RegExp("^" + sails.config.moduleconfig.commands.prefix + name + " ?(.*)"), function(result, message) {
        callback(result[1].split(' '), message);
    });
};

Commands.prototype.registerHearingCommand = function(name, callback) {
    this.chat.hear(new RegExp(name), callback);
};

Commands.prototype.disable = function() {

};

module.exports = function (app, chat) {
    return new Commands(app, chat);
};

function simpleMessage(content) {
    return function(args, message) { message.reply(messageFormatter.format(content, message.content)); };
}

function simpleChannelMessage(content) {
    return function(args, message) { message.reply(messageFormatter.format(content, message.content)); };
}
