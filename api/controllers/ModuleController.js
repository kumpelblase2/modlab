module.exports = {
    index: function(req, res) {
        if(req.user.hasPermission('system.modules.view')) {
            res.view('modules/index', { modules: sails.app.modules });
        } else {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        }
    }
};
