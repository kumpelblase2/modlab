module.exports.chat = {
    adapter: 'twitch',
    twitch: {
        port: 6667,
        server: 'irc.twitch.tv',
        // name: 'kumpelbot', Optional
        room: '#itshafu',
        token: 'oauth:aaaaaaaaaaaaaaaaaa',
        debug: true,
        reconnect: true,
        reconnectTime: 60
    }
};
