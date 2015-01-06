module.exports = function (chat, app, done) {
    chat.hear(/poop/, function (message) {
        message.reply('POOPY MCPOOPSTER');
    });

    chat.hear(/butts/i, function (message) {
        message.reply('Mr Butt Buttington');
    });

    done(null);
};
