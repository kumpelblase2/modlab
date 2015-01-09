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
            return _.contains(this.permissions, inPermission) || _.some(this.permission_groups, function (permissionGroup) {
                _.contains(permissionGroup.permissions, inPermission);
            });
        },
        addPermission: function(permission) {
            this.permissions.push(permission);
        },
        removePermission: function(permission) {
            this.permissions = _.without(this.permissions, permission);
        },
        addToPermissionGroup: function(group) {

        },
        removeFromPermissionGroup: function(group) {

        }
    }
};

module.exports = User;
