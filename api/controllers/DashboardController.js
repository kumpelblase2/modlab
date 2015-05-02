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
            ModuleService.renderWidgets(sails.app.customWidgets, req, res).then(function(widgets) {
                res.view({ widgets: widgets });
            });
        }
    }
};
