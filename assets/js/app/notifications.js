$(function() {
    var notificationBar = $('#notifications');
    $.getJSON('notifications', function(notifications) {
        if(notifications.notifications && notifications.notifications.length > 0) {
            notifications.notifications.forEach(function (notification) {
                notificationBar.prepend(JST["assets/templates/notifications/notification.html"]({
                    notification: notification
                }));
            });
        } else {
            notificationBar.prepend('<li>No notifications</li>');
        }
    });
});
