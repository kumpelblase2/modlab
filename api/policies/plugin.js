var path = require('path');

module.exports = function(req, res, next) {
    if(req.path.indexOf('/p/') === 0) {
        var pluginName = req.path.slice(3);
        pluginName = pluginName.substring(0, pluginName.indexOf('/'));
        var plugin = sails.app.plugins[pluginName];
        var viewDir = plugin.viewDir || 'views';
        var viewsPath = path.join(plugin.relPath, viewDir);
        res.old_view = res.view;
        res.view = function() {
            arguments[0] = path.join('..', viewsPath, arguments[0]);
            res.old_view.apply(res, arguments);
        };
    }
    next();
};
