module.exports.moduleconfig = {
    commands: {
        prefix: '!',
        formatters: [
            {
                name: 'Current time replacement',
                regex: /%time/i,
                replacement: function() {
                    return UtilityService.displayDate(new Date());
                }
            },
            {
                name: 'Modlab name',
                regex: /%name/i,
                replacement: function() {
                    return sails.config.modlab.name;
                }
            },
            {
                name: 'Person who sent command',
                regex: /%sender/i,
                replacement: function(message, data) {
                    return data.message.user.name;
                }
            }
        ]
    }
};
