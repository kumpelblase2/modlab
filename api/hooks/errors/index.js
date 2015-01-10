module.exports = function(sails) {
    return {
        initialize: function(callback) {
            if(sails.config.prettyerror.enabled) {
                require('pretty-error').start();
            }
        }
    };
};
