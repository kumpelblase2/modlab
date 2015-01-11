module.exports = {
    index: function(req, res) {
        res.view('dashboard/plugins/index', { plugins: sails.app.plugins });
    }
};
