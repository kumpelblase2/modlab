module.exports = {
    checkDisplay: function(page, request) {
        if(page.requires && page.requires.login) {
            if(!request.isAuthenticated()) {
                return false;
            } else {
                if(page.requires.permissions) {
                    var perms = Array.isArray(page.requires.permissions) ? page.requires.permissions : [ page.requires.permissions ];
                    if(!_.all(perms, function(perm) { return request.user.hasPermission(perm); })){
                        return false;
                    }
                }
            }
        }

        return true;
    }
};
