var _ = require('lodash');

module.exports = {
    index: function(req, res) {
        if(!req.user.hasPermission('system.widgets.view')) {
            return res.notFound();
        }

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
    },

    hide: function(req, res) {
        if(!req.user.hasPermission('system.widgets.view')) {
            return res.notFound();
        }

        var id = req.param('id');
        if(!id) {
            res.notFound();
        } else {
            id = id.replace('_', '#');
            var widget = _.find(sails.app.customWidgets, function(widget) { return widget.id === id; });
            req.user.addHiddenWidget(widget.id);
            req.user.save().then(function() {
                res.redirect('/widgets');
            });
        }
    },

    show: function(req, res) {
        if(!req.user.hasPermission('system.widgets.view')) {
            return res.notFound();
        }

        var id = req.param('id');
        if(!id) {
            res.notFound();
        } else {
            id = id.replace('_', '#');
            var widget = _.find(sails.app.customWidgets, function(widget) { return widget.id === id; });
            req.user.removeHiddenWidget(widget.id);
            req.user.save().then(function() {
                res.redirect('/widgets');
            });
        }
    }
};
