module.exports = {
    create: function(inMessage, inType, inUser) {
        return Log.create({
            issuer: inUser || null,
            message: inMessage,
            type: inType
        });
    }
};
