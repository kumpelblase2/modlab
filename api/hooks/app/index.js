module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var App = require('../../app');
            sails.app = new App();
            sails.log.verbose('Loaded main app');
            cb();
        }
    };
};
