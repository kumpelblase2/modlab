var Promise = require('bluebird');

module.exports = function(sails) {
    return {
        initialize: function(cb) {
            global['sails'] = Promise.promisifyAll(sails);

            var App = require('../../app');
            sails.app = new App();
            sails.log.verbose('Loaded main app');
            sails.after('hook:orm:loaded', function() {
                sails.models.dataregister.findOne({ key: 'installation' }).then(function(installation) {
                    if(installation) {
                        sails.app.installation = installation;
                    }
                })
            });
            cb();
        }
    };
};
