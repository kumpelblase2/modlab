var Promise = require('bluebird');
var path = require('path');

module.exports = {
    renderWidgets: function(widgets, req, res) {
        return Promise.map(widgets, function(widget) {
            var controller = widget.controller.toLowerCase();
            var action = widget.action;
            var id = widget.id;
            if(!WidgetService.canDisplayFor(req.user, widget)) {
                return;
            }

            return Promise.resolve().then(function() {
                return sails.controllers[controller][action](req);
            }).then(function(result) {
                if(result) {
                    result.owner = widget;
                    if(typeof(result.content) === 'object') {
                        return new Promise(function(resolve, reject) {
                            sails.renderView(path.join('..', widget.module.relPath, result.content.template), result.content.vars, function(err, resultString) {
                                if(err) {
                                    reject(err);
                                } else {
                                    result.rendered = resultString;
                                    resolve(result);
                                }
                            });
                        });
                    } else {
                        result.rendered = result.content;
                        return result;
                    }
                }
            });
        }, { concurrency: 3 });
    },

    canDisplayFor: function(user, widget) {
        if(user && user.hidesWidget(widget.id)) {
            return false;
        }

        if(widget.permission !== '') {
            if(!user || !user.hasPermission(widget.permission)) {
                return false;
            }
        }

        return true;
    }
};
