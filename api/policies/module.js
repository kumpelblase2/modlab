var path = require('path');
var myParser = require('../app/CustomParser');

module.exports = function(req, res, next) {
    if(req.path.indexOf('/m/') === 0) {
        var modName = req.path.slice(3);
        modName = modName.substring(0, modName.indexOf('/'));
        var mod = sails.app.modules[modName];
        var viewDir = mod.viewDir || 'views';
        var viewsPath = path.join(mod.relPath, viewDir);
        res.old_view = res.view;
        res.view = function() {
            arguments[0] = path.join('..', viewsPath, arguments[0]);
            var layoutPath = path.join('layout', 'default.jade');
            if(arguments.length <= 1) {
                arguments[1] = { layout: layoutPath };
            } else {
                arguments[1].layout = layoutPath;
            }

            arguments[1].parser = myParser;
            var temp = [ arguments[0], arguments[1] ];
            res.old_view.apply(res, temp);
        };
    }
    next();
};
