/**
 * PermissionGroup.js
 *
 * @description :: A group which has a set of permissions.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        name: { type: 'string' },

        permissions: { type: 'array', defaultsTo: [] },

        users_in_group: { collection: 'User', via: 'permission_groups', dominant: true }
    }
};
