var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

    attributes: {
        username: { type: 'string', unique: true },
        email: { type: 'email',  unique: true },
        passports: { collection: 'Passport', via: 'user' },
        permissions: { type: 'array', defaultsTo: [] },
        permission_groups: { collection: 'PermissionGroup', via: 'users_in_group', defaultsTo: [] },

        hasPermission: function (inPermission) {
            return PermissionService.isIncluded(this.permissions, inPermission) || _.some(this.permission_groups, function(group) {
                PermissionService.isIncluded(group.permissions, inPermission);
            });
        },
        allPermissions: function() {
            var all = [];
            this.permissions.forEach(function(perm) {
                all.push(perm);
            });

            this.permission_groups.forEach(function(group) {
                group.permissions.forEach(function(perm) {
                    all.push(perm);
                });
            });

            return all;
        },

        addPermission: function(permission) {
            this.permissions.push(permission);
        },
        removePermission: function(permission) {
            this.permissions = _.without(this.permissions, permission);
        },
        addToPermissionGroup: function(group) {
            this.permission_groups.add(group.id);
        },
        removeFromPermissionGroup: function(group) {
            this.permission_groups.remove(group.id);
        },

        strip: function() {
            var tmp = _.pick(this, 'id', 'username', 'email', 'permissions');
            tmp.groups = this.permission_groups.map(function(group) {
                return { id: group.id, name: group.name };
            });
            return tmp;
        }
    }
};

module.exports = User;
