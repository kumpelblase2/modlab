module.exports = {
    escapeRegex: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },

    displayDate: function(inDate) {
        var time = {
            date: inDate.getDate(),
            month: inDate.getMonth(),
            year: inDate.getFullYear(),
            hours: inDate.getHours(),
            minutes: inDate.getMinutes(),
            seconds: inDate.getSeconds()
        };

        Object.keys(time).forEach(function(key) {
            if(time[key] < 10) {
                time[key] = '0' + time[key];
            }
        });


        return time.date + "." + time.month + "." + time.year + " " + time.hours + ":" + time.minutes + ":" + time.seconds + " (" + (inDate.getTimezoneOffset() / 60) + ")";
    }
};
