function Commands(chat)
{
    this.name = "commands";
    this.version = "0.0.1";
    this.chat = chat;
    this.models = { 'Command': require('./command') };
}

Commands.prototype.enable = function(callback) {
    var self = this;
    Command.find().exec(function(err, commands) {
        if(commands) {
            commands.forEach(function(command) {
                switch(command.type) {
                    case 'hear':
                        self.chat.hear(new RegExp(command.value.regex), function(message) {
                            message.reply(command.value.message);
                        });
                        break;
                }
            });
        }
        callback();
    });
};

Commands.prototype.disable = function() {

};

module.exports = function (app, chat) {
    return new Commands(chat);
};
