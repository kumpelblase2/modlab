var path = require('path');

module.exports = {
    serve: function(req, res) {
        var moduleName = req.param('module');
        var file = req.param(0);

        if(!sails.app.modules.hasOwnProperty(moduleName)) {
            res.notFound();
        } else {
            var module = sails.app.modules[moduleName];
            res.sendfile(path.join(module.assetDirectory, file));
        }
    },
    _config: {
        rest: false,
        shortcuts: false
    }
};
