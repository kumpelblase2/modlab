/**
 * PermissionGroup.js
 *
 * @description :: A group which has a set of permissions.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        name: { type: 'string', unique: true },

        permissions: { type: 'array', defaultsTo: [] },

        users_in_group: { collection: 'User', via: 'permission_groups', dominant: true },

        strip: function() {
            var tmp = _.pick(this, 'id', 'name', 'permissions');
            tmp.users = this.users_in_group.map(function(user) {
                return { id: user.id, username: user.username };
            });
            return tmp;
        }
    }
};
