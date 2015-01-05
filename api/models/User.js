/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        username: {type: 'string'},

        authentication_provider: {type: 'string'},

        special_group: {type: 'integer'},

        provider_data: {type: 'string'},

        permissions: {type: 'array'},

        permission_groups: {collection: 'PermissionGroup', via: 'users_in_group'},

        hasPermission: function (inPermission) {
            return _.contains(this.permissions, inPermission) || _.some(this.permission_groups, function (permissionGroup) {
                    _.contains(permissionGroup.permissions, inPermission);
                });
        }
    }
};
