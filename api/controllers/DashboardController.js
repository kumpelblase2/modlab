/**
 * DashboardController
 *
 * @description :: Server-side logic for managing Dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function (req, res) {
        if(!req.user.hasPermission('system.dashboard.view')) {
            res.forbidden(req.__('Error.Authorization.NoRights'));
        } else {
            var widgetContents = [];

            sails.app.customWidgets.forEach(function(widget) {
                var controller = widget.controller.toLowerCase();
                var action = widget.action;
                var result = sails.controllers[controller][action](req);
                if(result) {
                    result.owner = widget;
                    widgetContents.push(result);
                }
            });
            res.view({ widgets: widgetContents });
        }
    }
};
