module.exports = {
    module: function() {
        return {
            name: 'LiveChat',
            size: 5,
            content: {
                template: 'views/widget',
                vars: {}
            }
        };
    },

    index: function(req, res) {
        res.view('livechat');
    }
};
