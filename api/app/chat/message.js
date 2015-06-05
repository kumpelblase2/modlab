function Message(channel, adapter, user, message) {
    this.channel = channel;
    this.adapter = adapter;
    this.user = user;
    this.content = message;
}

Message.prototype.reply = function(message) {
    this.adapter.send(message);
};

Message.prototype.replyToUser = function(message) {
    this.adapter.send(this.user.username + ": " + message);
};

module.exports = Message;
