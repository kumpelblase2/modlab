/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index: function(req, res) {
        var limit = parseInt(req.query.limit) || 25;
        Notification.find({ user: req.user.id, sort: 'createdAt desc', limit: limit }).then(function(notifications) {
            if(req.wantsJSON) {
                res.jsonx({ notifications: notifications });
            } else {
                res.view({notifications: notifications});
            }
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
