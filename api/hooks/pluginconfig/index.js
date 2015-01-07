var path = require('path');
var fs = require('fs');

module.exports = function(sails) {
    return {
        initialize: function(callback) {
            var pluginConfDir = path.join(sails.config.rootPath, 'config', 'plugin');
            sails.config.plugin = {};
            fs.readdirSync(pluginConfDir).forEach(function(file) {
                var name = file.split('.')[0];
                sails.config.plugin[name] = require(path.join(pluginConfDir, file));
            });
            callback();
        }
    };
};
