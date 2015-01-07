function Commands(chat)
{
    this.name = "commands";
    this.version = "0.0.1";
    this.chat = chat;
}

Commands.prototype.init = function(config, callback) {
    callback();
};

Commands.prototype.enable = function(callback) {
    this.chat.hear(/hello/, function(message) {
        message.reply('Hello!');
    });
    callback();
};

Commands.prototype.disable = function() {

};

module.exports = function (app, chat) {
    return new Commands(chat);
};
