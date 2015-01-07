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
    update: function(req, res) {
        res.ok();
    },
    delete: function(req, res) {
        res.ok();
    }
};
