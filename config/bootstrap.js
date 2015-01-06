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
var async = require('async');

module.exports.bootstrap = function (cb) {

    var App = require('../api/app');
    sails.app = new App();

    var chat = require('modlab-chat');
    var bot = chat.loadBot(null, sails.config.chat.adapter, 'kumpelbot');
    sails.chat = bot;

    var plugins = sails.config.plugins;
    var waiting = [];
    Object.keys(plugins).forEach(function(plugin) {
        waiting.push(function(callback) {
            sails.log.info('Loading plugin ' + plugin + ' ...');
            var pluginInfo = plugins[plugin];
            var pluginMain;
            if (pluginInfo.path) {
                pluginMain = require(pluginInfo.path);
            } else {
                pluginMain = require(pluginInfo.name);
            }

            pluginMain(bot, sails.app, callback);
        });
    });

    async.parallel(waiting, function(err, result) {
        if(err)
            sails.log.error(err);

        sails.log.info('All plugins loaded, connecting to chat ...');
        bot.run();
        cb();
    });
};
