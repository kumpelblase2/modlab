module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var chat = require('modlab-chat');
            sails.chat = chat.loadBot(null, sails.config.chat.adapter, 'kumpelbot');
            sails.chat.hear(/(.*)/, function(message) {
                sails.sockets.blast('chat', { message: message.match[0], user: message.message.user.name });
            });
            sails.log.verbose('Loaded chat');
            cb();
        }
    };
};
