/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function(req, res) {
        Notification.create({
            user: req.user.id,
            type: 'group',
            title: 'Poopy',
            url: 'http://google.com/',
            message: 'This is a test notification'
        }).then(function() {
            Notification.find({ user: req.user.id }).then(function(notifications) {
                if(req.wantsJSON) {
                    res.jsonx({ notifications: notifications });
                } else {
                    res.view({notifications: notifications});
                }
            });
        });
    },

    markSeen: function(req, res) {
        var id;
        if(req.param('ids')) {
            id = req.param('ids').split(',');
        } else {
            id = req.param('id');
        }

        Notification.update({ id: id, user: req.user.id }, {
            seen: new Date()
        }).then(function() {
            res.ok();
        });
    }
};
