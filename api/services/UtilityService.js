module.exports = {
    escapeRegex: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },

    displayDate: function(inDate) {
        return inDate.getDate() + "." + inDate.getMonth() + "." + inDate.getFullYear() + " " + inDate.getHours() + ":" + inDate.getMinutes() + ":" + inDate.getSeconds() + " (" + (inDate.getTimezoneOffset() / 60) + ")";
    }
};
