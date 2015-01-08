function Test()
{
    this.name = "tests";
    this.version = "0.0.1";
}

Test.prototype.init = function(callback) {
    callback();
};

Test.prototype.enable = function(callback) {
    callback();
};


Test.prototype.disable = function() {

};

module.exports = function (app, chat) {
    return new Test();
};
