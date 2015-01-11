module.exports = {
    '1': function(req, res) {
        if(sails.app.installation.step > 1)
            return res.notFound();

        if(req.method === 'POST') {
            var username = req.param('username');
            var password = req.param('password');
            var email = req.param('email') || 'admin@localhost.com';

            RegisterService.register(username, email, password, function(err, user) {
                if(err) {
                    res.view({
                        errors: [req.__(err.message)]
                    });
                } else {
                    sails.app.installation.step = 2;
                    sails.app.installation.save().then(function() {
                        user.addPermission('user.admin');
                        return user.save();
                    }).then(function() {
                        res.redirect('/login?redirect=install/steps/2');
                    }).catch(function(err) {
                        console.log(err);
                    });
                }
            });
        } else {
            res.view();
        }
    },

    '2': function(req, res) {
        res.view();
    }
};
