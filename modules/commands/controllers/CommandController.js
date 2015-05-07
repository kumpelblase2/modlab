module.exports = {
    index: function(req, res) {
        Command.find().exec(function(err, commands) {
            res.view('index', { commands: commands });
        });
    },
    create: function(req, res) {
        var self = this;
        Command.create({
            name: req.param('name'),
            type: req.param('type'),
            data: req.param('data')
        }).then(function(command) {
            req.flash('new_command', command);
            self.index(req, res);
        });
    },
    update: function(req, res) {
        Command.find(req.param('id')).then(function(command) {
            command.name = req.param('name', command.name);
            command.type = req.param('type', command.type);
            command.data = req.param('data', command.data);
            return Command.save(command);
        }).then(function() {
            res.redirect('/m/commands/');
        });
    },
    deleteC: function(req, res) {
        Command.delete(req.param('id')).then(function() {
            res.redirect('/m/commands/');
        });
    }
};
