/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    hasPermission: function (req, res) {
        User.findOne(1).exec(function (err, user) {
            res.send(user.hasPermission(req.param('perm')));
        });
    },

    index: function(req, res) {
        User.find().exec(function(err, users) {
            res.ok({ users: users });
        });
    },

    show: function(req, res) {
        res.ok();
    },
    profile: function(req, res) {
        if(req.user.hasPermission('user.profile.view')) {
            User.find({ username: req.user.username }).populate('passports').populate('permission_groups').exec(function(err, user) {
                res.view({ user: user[0] });
            });
        } else {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        }
    },
    update: function(req, res) {
        res.ok();
    },
    delete: function(req, res) {
        res.ok();
    }
};
