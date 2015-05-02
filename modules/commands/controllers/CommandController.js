module.exports = {
    index: function(req, res) {
        Command.find().exec(function(err, commands) {
            res.view('index', { commands: commands });
        });
    }
};
