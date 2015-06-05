var twitchirc = require('./twitchirc');
var dummy = require('./dummy');

module.exports = {
    twitch: twitchirc,
    dummy: dummy,
    loadBot: function(adapter, config) {
        var adapterImpl = this[adapter];
        return adapterImpl(config);
    }
};
