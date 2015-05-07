module.exports = {
    module: function(req) {
        if(!req.user.hasPermission('widget.livechat.view')){
            return false;
        }

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
        if(req.user.hasPermission('wdiget.livechat.view')) {
            res.view('livechat');
        } else {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        }
    }
};
