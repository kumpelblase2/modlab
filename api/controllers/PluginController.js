module.exports = {
    index: function(req, res) {
        if(req.user.hasPermission('system.plugins.view')) {
            res.view('plugins/index', { plugins: sails.app.plugins });
        } else {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        }
    }
};
