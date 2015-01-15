module.exports = {
    index: function(req, res) {
        if(!req.user.hasPermission('system.rights.view')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            User.find().populate('permission_groups').then(function(users) {
                var minifiedUsers = users.map(function(user) {
                    return user.strip();
                });

                PermissionGroup.find().populate('users_in_group').then(function(groups) {
                    var minifiedGroups = groups.map(function(group) {
                        return group.strip();
                    });
                    res.view('rights/index', { users: minifiedUsers, groups: minifiedGroups });
                });
            });
        }
    },

    userShow: function(req, res) {
        if(!req.user.hasPermission('system.rights.view')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var userid = req.param('id');
            User.findOne(userid).populate('permission_groups').then(function(user) {
                if(!user) {
                    return res.notFound('Error.Resource.NotFound');
                }

                res.view('rights/user', { user: user.strip() });
            }).catch(function(err) {
                res.serverError(err);
            });
        }
    },

    groupShow: function(req, res) {
        if(!req.user.hasPermission('system.rights.view')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var groupid = req.param('id');
            PermissionGroup.findOne(groupid).populate('users_in_group').then(function(group) {
                if(!group) {
                    return res.notFound('Error.Resource.NotFound');
                }

                res.view('rights/group', { group: group.strip() });
            }).catch(function(err) {
                res.serverError(err);
            });
        }
    },

    groupNew: function(req, res) {
        if(!req.user.hasPermission('system.rights.group.create')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            res.view('rights/groupedit');
        }
    },

    groupCreate: function(req, res) {
        if(!req.user.hasPermission('system.rights.group.create')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var name = req.param('name');
            var permissions = req.param('permissions[]');
            if(!Array.isArray(permissions)) {
                permissions = [ permissions ];
            }

            PermissionGroup.create({
                name: name,
                permissions: _.filter(permissions, function(permission) { return permission.length > 0 })
            }).then(function(group) {
                res.redirect('/rights/group/' + group.id);
            });
        }
    },

    groupEdit: function(req, res) {
        if(!req.user.hasPermission('system.rights.group.edit')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var groupid = req.param('id');
            PermissionGroup.findOne(groupid).then(function(group) {
                if(!group) {
                    return res.notFound('Error.Resource.NotFound');
                }

                res.view('rights/groupedit', { group: group });
            });
        }
    },

    userEdit: function(req, res) {
        if(!req.user.hasPermission('system.rights.user.edit')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var userid = req.param('id');
            User.findOne(userid).then(function(user) {
                if(!user) {
                    return res.notFound('Error.Resource.NotFound');
                }

                res.view('rights/useredit', { user: user.strip() });
            });
        }
    },

    groupUpdate: function(req, res) {
        if(!req.user.hasPermission('system.rights.group.edit')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var id = req.param('id');
            var name = req.param('name');
            var permissions = req.param('permissions[]');
            if(!Array.isArray(permissions)) {
                permissions = [ permissions ];
            }

            PermissionGroup.update(id, {
                name: name,
                permissions: _.filter(permissions, function(permission) { return permission.length > 0 })
            }).then(function(groups) {
                sails.controllers.rights.groupShow(req, res);
            });
        }
    },

    userUpdate: function(req, res) {
        if(!req.user.hasPermission('system.rights.user.edit')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var id = req.param('id');
            var permissions = req.param('permissions[]');
            if(!Array.isArray(permissions)) {
                permissions = [ permissions ];
            }

            User.update(id, {
                permissions: _.filter(permissions, function(permission) { return permission.length > 0 })
            }).then(function(users) {
                sails.controllers.rights.userShow(req, res);
            });
        }
    },

    groupDelete: function(req, res) {
        if(!req.user.hasPermission('system.rights.group.delete')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var id = req.param('id');
            PermissionGroup.destroy(id).then(function() {
                res.redirect('/rights');
            }).catch(function(err) {
                console.log(err);
            });
        }
    }
};
