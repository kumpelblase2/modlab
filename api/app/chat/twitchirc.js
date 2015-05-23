var twitchirc = require('twitch-irc');
var util = require('util');
var Base = require('./base');
var _ = require('lodash');

function TwitchIRC(config) {
    TwitchIRC.super_.call(this);

    var twitchClientOptions = {
        options: {
            debug: config.debug,
            emitSelf: true
        },
        connection: {
            reconnect: true,
            retries: config.reconnectTries
        },
        identity: {
            username: config.name || 'kumpelbot',
            password: config.token
        },
        channels: [ config.room ]
    };

    this.room = config.room;
    this.client = twitchirc.client(twitchClientOptions);
    this.client.connect();
    this.name = twitchClientOptions.identity.username;
    this.hearings = {};

    var self = this;
    this.on('chat', function(channel, user, message) {
        if(channel == self.room && user.username != self.name) {
            _.forOwn(self.hearings, function(hearing, hearingName) {
                var result = hearing.toHear.exec(message);
                if(result) {
                    hearing.callback(user, message, result);
                }
            });
        }
    });
}

util.inherits(TwitchIRC, Base);

TwitchIRC.prototype.on = function(event, callback) {
    this.client.addListener(event, callback);
};

TwitchIRC.prototype.isMod = function(inUser) {
    return this.client.isMod(this.room, inUser);
};

TwitchIRC.prototype.hear = function(name, toHear, callback) {
    if(this.hearings[name]) {
        return false;
    }

    this.hearings[name] = {
        toHear: toHear,
        callback: callback
    };
};

TwitchIRC.prototype.emit = function() {
    this.client.emit.call(this, arguments);
};

TwitchIRC.prototype.send = function(message) {
    this.client.say(this.room, message);
};

module.exports = function(config) {
    return new TwitchIRC(config);
};
