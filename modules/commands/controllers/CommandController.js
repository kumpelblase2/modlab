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
    prepareNew: function(req, res) {
        res.view('edit');
    },
    update: function(req, res) {
        Command.find(req.param('id')).then(function(command) {
            command = command[0];
            command.name = req.param('name', command.name);
            command.type = req.param('type', command.type);
            command.data = req.param('data', command.data);
            return new Promise(function(resolve, reject) {
                Command.update(command).then(resolve).catch(reject);
            });
        }).then(function() {
            self.index(req, res);
        });
    },
    deleteC: function(req, res) {
        Command.destroy(req.param('id')).then(function() {
            res.ok();
        });
    },
    edit: function(req, res) {
        Command.find(req.param('id')).then(function(command) {
            res.view('edit', { command: command[0] });
        });
    }
};
