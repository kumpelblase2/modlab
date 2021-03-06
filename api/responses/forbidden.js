/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(403);

    // Log error to console
    if (data !== undefined) {
        sails.log.verbose('Sending 403 ("Forbidden") response: \n', data);
    }
    else sails.log.verbose('Sending 403 ("Forbidden") response');

    // Only include errors in response if application environment
    // is not set to 'production'.  In production, we shouldn't
    // send back any identifying information about errors.
    if (sails.config.environment === 'production') {
        data = undefined;
    }

    // If the user-agent wants JSON, always respond with JSON
    if (req.wantsJSON) {
        return res.jsonx(data);
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = (typeof options === 'string') ? {view: options} : options || {};

    // Put error in flash before any kind of response to ensure we can use it even in error pages.
    req.flash('error', data);

    // If a view was provided in options, serve it.
    // Otherwise try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
        if(res.old_view) {
            return res.old_view(options.view, { data: data });
        }
        return res.view(options.view, {data: data});
    }

    // If no second argument provided, try to serve the default view,
    // but fall back to sending JSON(P) if any errors occur.
    else {
        req.params.redirect = req.url.substring(1);
        if(res.old_view) {
            res.view = function () {
                res.old_view.apply(res, arguments);
            };
        }
        sails.controllers.auth.login(req, res);
    }
};
