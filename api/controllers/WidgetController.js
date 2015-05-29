module.exports = {
    index: function(req, res) {
        var widgets = sails.app.customWidgets;
        var displayedWidgets = [];
        var hiddenWidgets = [];
        widgets.forEach(function(widget) {
            if(req.user.hidesWidget(widget.id)) {
                hiddenWidgets.push(widget);
            } else {
                displayedWidgets.push(widget);
            }
        });

        res.view({visible: displayedWidgets, hidden: hiddenWidgets});
    }
};
