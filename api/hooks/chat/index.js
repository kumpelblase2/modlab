module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var chat = require('modlab-chat');
            sails.chat = chat.loadBot(null, sails.config.chat.adapter, 'kumpelbot');
            sails.log.verbose('Loaded chat');
            cb();
        }
    };
};
