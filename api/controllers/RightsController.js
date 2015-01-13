module.exports = {
    index: function(req, res) {
        if(!req.user.hasPermission('system.rights.view')) {
            res.forbidden('Error.Authorization.NoRights', '403');
        } else {
            User.find().populate('permission_groups').then(function(users) {
                var minifiedUsers = users.map(function(user) {
                    var tmp = _.pick(user, 'id', 'username', 'permissions');
                    tmp.groups = user.permission_groups.map(function(group) {
                        return group.name;
                    });
                    return tmp;
                });

                PermissionGroup.find().populate('users_in_group').then(function(groups) {
                    var minifiedGroups = groups.map(function(group) {
                        var temp = _.pick(group, 'id', 'name', 'permissions');
                        temp.users = group.users_in_group.length;
                        return temp;
                    });
                    res.view('rights/index', { users: minifiedUsers, groups: minifiedGroups });
                });
            });
        }
    },

    user: function(req, res) {
        var userid = req.param('id');
        User.findOne(userid).populate('permission_groups').then(function(user) {
            if(!user) {
                return res.notFound('Error.Resource.NotFound');
            }

            var tmp = _.pick(user, 'id', 'username', 'permissions');
            tmp.groups = user.permission_groups.map(function(group) {
                return { id: group.id, name: group.name };
            });
            res.view('rights/user', { user: tmp });
        }).catch(function(err) {
            res.serverError(err);
        });
    },

    group: function(req, res) {
        var groupid = req.param('id');
        PermissionGroup.findOne(groupid).populate('users_in_group').then(function(group) {
            if(!group) {
                return res.notFound('Error.Resource.NotFound');
            }

            var tmp = _.pick(group, 'id', 'name', 'permissions');
            tmp.users = group.users_in_group.map(function(user) {
                return { id: user.id, username: user.username };
            });
            res.view('rights/group', { group: tmp });
        }).catch(function(err) {
            res.serverError(err);
        });
    },

    createGroup: function(req, res) {
        res.ok();
    },

    deleteGroup: function(req, res) {
        res.ok();
    },

    groupEdit: function(req, res) {
        res.ok();
    },

    userEdit: function(req, res) {
        res.ok();
    }
};
