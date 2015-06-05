module.exports.chat = {
    disabled: false,
    adapter: 'twitch',
    twitch: {
        port: 6667,
        server: 'irc.twitch.tv',
        // name: 'kumpelbot', Optional
        room: '#itshafu',
        token: 'oauth:aaaaaaaaaaaaaaaaaa',
        debug: true,
        reconnect: true,
        reconnectTries: 5
    }
};
