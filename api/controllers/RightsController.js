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

            permissions = _.filter(permissions, function(permission) { return permission.length > 0 });

            RightsService.createGroup(name, permissions).then(function(group) {
                res.redirect('/rights/group/' + group.id);
            }).then(function() {
                return LogService.create('Group ' + name + ' created', LogService.TYPES.EVENT, req.user);
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
            User.findOne(userid).populate('permission_groups').then(function(user) {
                if(!user) {
                    return res.notFound('Error.Resource.NotFound');
                }

                PermissionGroup.find().then(function(groups) {
                    res.view('rights/useredit', { user: user.strip(), groups: _.map(groups, function(group) { return group.strip(); }) });
                });
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

            var self = this;
            PermissionGroup.update(id, {
                name: name,
                permissions: _.filter(permissions, function(permission) { return permission.length > 0 })
            }).then(function(groups) {
                self.groupShow(req, res);
            });
        }
    },

    userUpdate: function(req, res) {
        if(!req.user.hasPermission('system.rights.user.edit')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var id = req.param('id');
            var permissions = req.param('permissions[]');
            var permissionGroups = req.param('groups[]') || [];
            if(!Array.isArray(permissions)) {
                permissions = [ permissions ];
            }

            if(!Array.isArray(permissionGroups)) {
                permissionGroups = [ permissionGroups ];
            }

            permissionGroups = _.map(permissionGroups, function(groupid) { return parseInt(groupid); });
            var self = this;
            User.findOne(id).populate('permission_groups').then(function(user) {
                if(!user) {
                    return res.notFound('Error.Resource.NotFound');
                }

                user.permissions = _.filter(permissions, function(permission) {
                    return permission.length > 0;
                });

                user.permission_groups.forEach(function(group) {
                    var index = permissionGroups.indexOf(group.id);
                    if(index < 0) {
                        user.permission_groups.remove(group.id);
                    } else {
                        permissionGroups = _.without(permissionGroups, group.id);
                    }
                });

                permissionGroups.forEach(function(groupid) {
                    user.permission_groups.add(groupid);
                });

                user.save().then(function() {
                    self.userShow(req, res);
                }).catch(function(err) {
                    res.serverError(err);
                });
            }).catch(function(err) {
                res.serverError(err);
            });
        }
    },

    groupDelete: function(req, res) {
        if(!req.user.hasPermission('system.rights.group.delete')) {
            res.forbidden(req.__('Error.Authorization.NoRights'), '403');
        } else {
            var id = req.param('id');
            PermissionGroup.destroy(id).then(function() {
                return LogService.create('Deleted group with id ' + id, LogService.TYPES.EVENT, req.user);
            }).then(function() {
                return res.redirect('/rights');
            }).catch(function(err) {
                console.log(err);
            });
        }
    }
};
