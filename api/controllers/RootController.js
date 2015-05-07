module.exports = {
    index: function(req, res) {
        if(sails.config.modlab.disableHome) {
            res.redirect('/dashboard');
        } else {
            res.view('homepage');
        }
    }
};
