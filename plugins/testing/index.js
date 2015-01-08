var Plugin = require('modlab-plugin');
var util = require('util');

function Test(app, chat)
{
    Test.super_.call(this, app, chat, {
        name: "testing",
        version: "0.0.1"
    });
}

util.inherits(Test, Plugin);

module.exports = function (app, chat) {
    return new Test(app, chat);
};
