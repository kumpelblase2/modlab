module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }
    log: {
        level: 'error'
    },

    models: {
        connection: 'test',
        migrate: 'drop'
    },

    chat: {
        adapter: 'twitch',
        twitch: {
            port: 6667,
            server: 'irc.twitch.tv',
            // name: 'kumpelbot', Optional
            room: '#kumpelblase2',
            token: 'oauth:<the_token>',
            debug: true,
            reconnect: true,
            reconnectTime: 60
        }
    }
};
