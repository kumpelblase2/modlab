module.exports = function(sails) {
    return {
        initialize: function(cb) {
            sails.after('hook:app:loaded', function() {
                sails.log.verbose('Loading custom plugin models...');
                sails.models['test'] = {
                    attributes: {},
                    identity: 'test',
                    globalId: 'Test'
                };
                cb();
            });
        }
    };
};
