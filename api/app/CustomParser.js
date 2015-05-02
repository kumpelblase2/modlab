var Parser = require('jade').Parser;
var pathModule = require('path');

function myParser(string, filename, options) {
    Parser.call(this, string, filename, options);
}

myParser.prototype.__proto__ = Parser.prototype;

myParser.prototype.resolvePath = function(path, purpose) {
    var _super = Parser.prototype.resolvePath;

    var splitPath = path.split('/');

    if(splitPath[0] == 'default') {
        return pathModule.join(sails.config.rootPath, 'views', 'layout', 'default.jade');
    } else if (splitPath[0] == 'custom') {
        return _super.call(this, splitPath.slice(1).join('/'), purpose);
    } else {
        return _super.call(this, path, purpose);
    }
};


module.exports = myParser;
