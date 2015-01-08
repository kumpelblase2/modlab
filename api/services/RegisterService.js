module.exports = {
    register: function(name, mail, password, callback) {
        if(!name)
            return callback(new Error('Error.Passport.Username.Missing'));

        if(!mail)
            return callback(new Error('Error.Passport.Email.Missing'));

        if(!password)
            return callback(new Error('Error.Passport.Password.Missing'));

        User.create({
            username: name,
            email: mail
        }).then(function(user) {
            return Passport.create({
                protocol: 'local',
                password: password,
                user: user.id
            }).then(function() {
                return user;
            }).catch(function(err) {
                if (err.code === 'E_VALIDATION') {
                    err = new Error('Error.Passport.Password.Invalid');
                }

                return user.destroy().catch(function (destroyErr) {
                    throw destroyErr || err;
                });
            });
        }).then(function(user) {
            return callback(null, user);
        }).catch(function(err) {
            if (err.code === 'E_VALIDATION') {
                if (err.invalidAttributes.email) {
                    return callback(new Error('Error.Passport.Email.Exists'));
                } else {
                    return callback(new Error('Error.Passport.User.Exists'));
                }
            }

            return callback(err);
        });
    }
};
