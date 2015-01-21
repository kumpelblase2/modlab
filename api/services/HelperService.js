module.exports = {
    checkDisplay: function(page, request) {
        if(page.requires) {
            if(page.requires.login && !request.isAuthenticated()) {
                return false;
            }

            if(page.requires.permissions) {
                var perms = Array.isArray(page.requires.permissions) ? page.requires.permissions : [ page.requires.permissions ];
                if(!_.all(perms, function(perm) { return request.user.hasPermission(perm); })){
                    return false;
                }
            }
        }

        return true;
    }
};
