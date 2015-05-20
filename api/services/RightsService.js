module.exports = {
    createGroup: function(inName, inPermissions) {
        return PermissionGroup.create({
            name: inName,
            permissions: inPermissions || []
        });
    }
};
