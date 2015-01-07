var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

    attributes: {
        username: { type: 'string', unique: true },
        email: { type: 'email',  unique: true },
        passports: { collection: 'Passport', via: 'user' },
        permissions: { type: 'array' },
        permission_groups: { collection: 'PermissionGroup', via: 'users_in_group' },
        hasPermission: function (inPermission) {
            return _.contains(this.permissions, inPermission) || _.some(this.permission_groups, function (permissionGroup) {
                _.contains(permissionGroup.permissions, inPermission);
            });
        }
    }
};

module.exports = User;
