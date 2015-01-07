var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = {
    filter: function(plugins) {
        var toLoad = [];
        _.forOwn(plugins, function(options, name) {
            if(!options)
                return;

            if(options === true) {
                toLoad.push({
                    name: name,
                    source: 'npm'
                });
            } else if(typeof(options) === "object") {
                if(options.disabled)
                    return;

                var source = options.path ? 'local' : 'npm';
                toLoad.push(_.merge({ source: source, name: name }, options, function(a, b) { return b ? b : a; }));
            }
        });

        return toLoad;
    },
    loadConfig: function(name) {
        var file = path.join(sails.config.rootPath, 'config', 'plugins', name);
        if(fs.existsSync(file)) {
            return require(file);
        } else {
            return {};
        }
    }
};
