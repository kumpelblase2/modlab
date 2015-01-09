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
                    } else {
                        sails.models.dataregister.create({ key: 'installation', value: { step: '1', finished: false } }).then(function(installation) {
                            sails.app.installation = installation;
                        });
                    }
                })
            });
            cb();
        }
    };
};
