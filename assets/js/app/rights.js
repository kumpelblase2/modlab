$(function() {
    $('#btnAddPermission').click(function() {
        $(this).parent().append(JST["assets/templates/rights/permissioninput.html"]);
    });
});
