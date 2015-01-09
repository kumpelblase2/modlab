module.exports = {
    '1': function(req, res) {
        if(req.method === 'POST') {
            var username = req.param('username');
            var password = req.param('password');
            var email = req.param('email') || 'admin@localhost.com';

            RegisterService.register(username, email, password, function(err, user) {
                console.log(err);
                console.log(user);
                if(err) {
                    res.view({
                        errors: [req.__(err.message)]
                    });
                } else {
                    res.redirect('/login?redirect=/install/steps/2');
                }
            });
        } else {
            res.view();
        }
    }
};
