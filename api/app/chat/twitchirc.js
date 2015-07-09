var tmi = require('tmi.js');
var util = require('util');
var Base = require('./base');
var _ = require('lodash');
var Message = require('./message');

function TwitchIRC(config) {
    TwitchIRC.super_.call(this);

    var twitchClientOptions = {
        options: {
            debug: config.debug
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: config.name || 'kumpelbot',
            password: config.token
        },
        channels: [ config.room ]
    };

    this.room = config.room;
    this.client = new tmi.client(twitchClientOptions);
    this.name = twitchClientOptions.identity.username;
    this.hearings = [];
    this.currentHostTarget = null;

    var log = function(message) {
        return function() {
            LogService.create(message, LogService.TYPES.EVENT);
        }
    };

    var self = this;
    this.on('join', function() {
        sails.log.info('Connected to chat');
    });

    this.on('join', log('Connected to chat'));
    this.on('disconnected', log('Disconnected from chat'));
    this.on('connectfail', log('Connection failed'));
    this.on('reconnect', log('Reconnect'));
    this.on('hosting', function(channel, target, viewers) {
        LogService.create('Hosting ' + target, LogService.TYPES.EVENT);
        sails.log.info('Hosting ' + target + ' with ' + viewers + ' viewers.');
        self.currentHostTarget = target;
    });
    this.on('unhost', function(channel, target) {
        LogService.create('Stopped hosting ' + target, LogService.TYPES.EVENT);
        sails.log.info('Unhosting ' + target);
        self.currentHostTarget = null;
    });

    this.on('chat', function(channel, user, message) {
        LogService.create(user.username + ': ' + message, LogService.TYPES.CHAT);
    });

    this.on('action', function(channel, user, message) {
        LogService.create(user.username + ': /me' + message, LogService.TYPES.CHAT);
    });

    this.on('timeout', function(channel, user) {
        LogService.create(user + ' got timed out', LogService.TYPES.EVENT.CHAT);
    });

    this.on('chat', function(channel, user, message) {
        if(channel == self.room && user.username != self.name) {
            self.hearings.forEach(function(hearing) {
                var result = hearing.toHear.exec(message);
                if(result) {
                    hearing.callback(result, new Message(channel, self, user, message));
                }
            });
        }
    });

    registerInService(this);
}

util.inherits(TwitchIRC, Base);

TwitchIRC.prototype.on = function(event, callback) {
    this.client.on(event, callback);
};

TwitchIRC.prototype.run = function() {
    return this.client.connect();
};

TwitchIRC.prototype.removeListener = function(event, callback) {
    this.client.removeListener(event, callback);
};

TwitchIRC.prototype.isMod = function(inUser) {
    return this.client.isMod(this.room, inUser);
};

TwitchIRC.prototype.hear = function(toHear, callback) {
    this.hearings.push({
        toHear: toHear,
        callback: callback
    });
};

TwitchIRC.prototype.removeHearing = function(callback) {
    for(var i = 0; i < this.hearings.length; i++) {
        if(this.hearings[i].callback === callback) {
            this.hearings.slice(i);
            return;
        }
    }
};

TwitchIRC.prototype.emit = function() {
    this.client.emit.call(this, arguments);
};

TwitchIRC.prototype.send = function(message) {
    this.client.say(this.room, message);
};

TwitchIRC.prototype.sendTo = function(user, message) {
    this.client.whisper(user, message);
};

TwitchIRC.prototype.timeout = function(user, time) {
    this.client.timeout(this.room, user, time);
};

TwitchIRC.prototype.ban = function(user) {
    this.client.ban(this.room, user);
};

TwitchIRC.prototype.host = function(target) {
    this.client.host(this.room, target);
};

TwitchIRC.prototype.unhost = function() {
    this.client.unhost(this.room);
};

TwitchIRC.prototype.getHostTarget = function() {
    return this.currentHostTarget;
};

TwitchIRC.prototype.playCommercial = function(inLength) {
    this.client.commercial(this.room, inLength);
};

module.exports = function(config) {
    return new TwitchIRC(config);
};


function registerInService(inTwitch) {
    var service = globals['StreamService'];

    service.unhost = inTwitch.unhost;
    service.host = inTwitch.host;
    service.getHostTarget = inTwitch.getHostTarget;
    service.playCommercial = inTwitch.playCommercial;

    globals['StreamService'] = service;
}
