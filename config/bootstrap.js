/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {
    sails.hooks.pluginloader.enableAll().then(function() {
        sails.services.passport.loadStrategies();
    }).then(function() {
        if(!sails.config.chat.disabled) {
            sails.chat.run();
        }
        sails.emit('app:bootstrap');
    }).then(function() {
        RegisterService.register('test', 'test@test.com', 'test', function(err, user) {
            cb();
        });
    }).catch(function(err) {
        return cb(err);
    });
};
