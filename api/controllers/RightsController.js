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
    }
};
