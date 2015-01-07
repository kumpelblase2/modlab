module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var chat = require('modlab-chat');
            var bot = chat.loadBot(null, sails.config.chat.adapter, 'kumpelbot');
            sails.chat = bot;
            sails.log.verbose('Loaded chat');
            cb();
        }
    };
};
