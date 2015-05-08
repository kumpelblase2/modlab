module.exports = function(sails) {
    return {
        initialize: function(cb) {
            sails.on('app:bootstrap', function() {
                LogService.create('System started', LogService.TYPES.EVENT).exec(function(err, log) {});
            });

            sails.config.beforeShutdown = function(cb) {
                LogService.create('System stopped', LogService.TYPES.EVENT).exec(function() { cb(); });
            };

            cb();
        }
    };
};
