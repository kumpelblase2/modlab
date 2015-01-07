var _ = require('lodash');

module.exports = function filter(plugins) {
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
};
