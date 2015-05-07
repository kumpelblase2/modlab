/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	view: function(req, res) {
        if(!req.user.hasPermission('system.logs.view')) {
            return res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        }

        Log.find().then(function(logs) {
            res.view({ logs: logs });
        });
    }
};

