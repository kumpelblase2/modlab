module.exports = function(sails) {
    return {
        initialize: function(cb) {
            sails.log.info('loaded app');
            var App = require('../../app');
            sails.app = new App();
            cb();
        }
    };
};
