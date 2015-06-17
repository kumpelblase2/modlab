var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

    attributes: {
        username: { type: 'string', unique: true },
        email: { type: 'email',  unique: true },
        passports: { collection: 'Passport', via: 'user' },
        permissions: { type: 'array', defaultsTo: [] },
        permission_groups: { collection: 'PermissionGroup', via: 'users_in_group', defaultsTo: [] },
        hidden_widgets: { type: 'array', defaultsTo: [] },

        hasAnyPermission: function(inPermissions, inProperty) {
            return PermissionService.hasAny(this.permissions, inPermissions, inProperty) || _.some(this.permission_groups, function(group) {
                    PermissionService.hasAny(group.permissions, inPermissions, inProperty);
                });
        },
        hasPermission: function (inPermission) {
            return this.hasAnyPermission([inPermission]);
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

        hidesWidget: function(widgetId) {
            return this.hidden_widgets.indexOf(widgetId) >= 0;
        },
        addHiddenWidget: function(widgetId) {
            this.hidden_widgets.push(widgetId);
        },
        removeHiddenWidget: function(widgetId) {
            this.hidden_widgets = _.without(this.hidden_widgets, widgetId);
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
