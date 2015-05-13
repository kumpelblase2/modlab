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

        var page = parseInt(req.query.page) || 1;
        var limit = parseInt(req.query.limit) || 25;

        Log.find().sort('createdAt desc').paginate({ page: page, limit: limit }).then(function(logs) {
            res.view({ logs: logs, page: page, limit: limit });
        });
    }
};

