module.exports = {
    index: function(req, res) {
        res.view();
    },
    test: function(req, res) {
        res.view('test');
    }
};
