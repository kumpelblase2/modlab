var path = require('path');

module.exports = {
    modules: function() {
        return {
            name: 'Plugins',
            size: 3,
            content: {
                template: 'widgets/modules',
                vars: {
                    moduleamount: Object.keys(sails.app.modules).length
                }
            }
        };
    },
    users: function(req) {
        return new Promise(function(resolve, reject) {
            User.count().exec(function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve({
                        name: 'Users',
                        size: 3,
                        content: {
                            template: 'widgets/users',
                            vars: {
                                useramount: result
                            }
                        }
                    });
                }
            });
        });
    },
    groups: function() {
        return new Promise(function(resolve, reject) {
            PermissionGroup.count().exec(function(err, result) {
                if(err) {
                    reject(err);
                } else {
                    resolve({
                        name: 'Groups',
                        size: 3,
                        content: {
                            template: 'widgets/groups',
                            vars: {
                                groupamount: result
                            }
                        }
                    });
                }
            });
        });
    }
};
