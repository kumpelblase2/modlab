module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var chat = require('../../app/chat/index');
            var adapter = sails.config.chat.adapter;
            sails.chat = chat.loadBot(adapter, sails.config.chat[adapter]);
            sails.log.verbose('Loaded chat');
            cb();
        }
    };
};
