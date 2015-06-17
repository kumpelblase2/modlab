module.exports = {
    TYPES: {
        CONFIG: 'config',
        EVENT: 'event',
        CHAT: 'chat'
    },

    create: function(inMessage, inType, inUser) {
        return Log.create({
            issuer: inUser || null,
            message: inMessage,
            type: inType
        }).then(function(user) { return user; });
    }
};
