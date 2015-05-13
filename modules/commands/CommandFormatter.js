module.exports = {
    formatters: [],
    format: function(message, data) {
        this.formatters.forEach(function(replacementInfo) {
            if(replacementInfo.regex.test(message)) {
                var replacement = '';
                if(typeof(replacementInfo.replacement) == 'function') {
                    replacement = replacementInfo.replacement(message, data);
                } else {
                    replacement = replacementInfo.replacement;
                }

                message = message.replace(replacementInfo.regex, replacement);
            }
        });

        return message;
    }
};
