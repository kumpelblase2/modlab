function refreshNotifications() {
    var notificationBar = $('#notifications');
    $.getJSON('notifications?limit=10', function(notifications) {
        console.log('reload');
        $('#no_notifies').remove();
        if(notifications.notifications && notifications.notifications.length > 0) {
            notifications.notifications.reverse().forEach(function (notification) {
                notificationBar.prepend(JST["assets/templates/notifications/notification.html"]({
                    notification: notification
                }));
            });
        } else {
            notificationBar.prepend('<li id="no_notifies"><p class="text-center">No notifications</p></li>');
        }
    });
}

$(function() {
    refreshNotifications();
    var state = false;
    $('#notification_menu').click(function() {
        state = !state;
        if(state) {
            refreshNotifications();
        }
    });
});
