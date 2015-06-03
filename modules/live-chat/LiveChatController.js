module.exports = {
    widget: function(req) {
        return {
            name: 'LiveChat',
            size: 5,
            content: {
                template: 'views/widget',
                vars: {}
            }
        };
    },

    index: function(req, res) {
        if(req.user.hasPermission('module.livechat.view')) {
            res.view('livechat');
        } else {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        }
    }
};
