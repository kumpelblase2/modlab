module.exports = {
    isIncluded: function(own_permissions, check) {
        if(check == null || check === '') {
            return false;
        }

        if(_.contains(own_permissions, check)) {
            return true;
        }

        var parts = check.split('.');
        return _.some(own_permissions, function(permission) {
            var splitted = permission.split('.');
            return PermissionService.matches(splitted, parts);
        });
    },

    matches: function(permission, match) {
        if(permission == null || match == null) {
            return false;
        }

        if(permission === match) {
            return true;
        }

        permission = (Array.isArray(permission) ? permission : permission.split('.'));
        match = (Array.isArray(match) ? match : match.split('.'));

        if(permission.length != match.length) {
            return false;
        }

        for(var i = 0; i < permission.length; i++) {
            var perm = permission[i];
            if(perm !== match[i] && perm !== '*') {
                return false;
            }
        }

        return true;
    },

    hasAny: function(own_permissions, other_permissions, property) {
        var i = 0;
        var max = other_permissions.length;
        for(; i < max; i++) {
            var elem = other_permissions[i];
            if(typeof(property) == 'function') {
                elem = property(elem);
            } else if(typeof(property) == 'string') {
                elem = elem[property];
            }

            if(PermissionService.isIncluded(own_permissions, elem)) {
                return true;
            }
        }

        return false;
    }
};
