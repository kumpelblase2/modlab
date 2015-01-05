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
    }
};
