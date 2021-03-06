/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    'GET /': 'RootController.index',

    /***************************************************************************
    *                                                                          *
    * Authentication routes                                                    *
    *                                                                          *
    ***************************************************************************/

    'GET /login': 'AuthController.login',
    'GET /logout': 'AuthController.logout',
    'GET /register': 'AuthController.register',

    'POST /auth/local': 'AuthController.callback',
    'POST /auth/local/:action': 'AuthController.callback',

    'GET /auth/:provider': 'AuthController.provider',
    'GET /auth/:provider/callback': 'AuthController.callback',
    'GET /auth/:provider/:action': 'AuthController.callback',


    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     *  If a request to a URL doesn't match any of the custom routes above, it  *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

    'GET /dashboard': 'DashboardController.index',
    'GET /modules': 'ModuleController.index',
    'GET /logs': 'LogController.view',

    'GET /rights': 'RightsController.index',
    'GET /rights/group/new': 'RightsController.groupNew',
    'GET /rights/user/:id': 'RightsController.userShow',
    'GET /rights/group/:id': 'RightsController.groupShow',
    'DELETE /rights/group/:id': 'RightsController.groupDelete',
    'GET /rights/group/:id/edit': 'RightsController.groupEdit',
    'GET /rights/user/:id/edit': 'RightsController.userEdit',
    'PUT /rights/group': 'RightsController.groupCreate',
    'POST /rights/group': 'RightsController.groupCreate',
    'PATCH /rights/group/:id': 'RightsController.groupUpdate',
    'POST /rights/group/:id': 'RightsController.groupUpdate',
    'PATCH /rights/user/:id': 'RightsController.userUpdate',
    'POST /rights/user/:id': 'RightsController.userUpdate',

    'GET /users': 'UserController.index',
    'GET /users/:id': 'UserController.show',
    'GET /user': 'UserController.profile',
    'GET /user/notifications': 'NotificationController.show',
    'GET /user/settings': 'SettingsController.show',
    'PATCH /users/:id': 'UserController.update',
    'POST /users/:id': 'UserController.update',
    'DELETE /users/:id': 'UserController.delete',

    'GET /widgets': 'WidgetController.index',
    'POST /widget/:id/hide': 'WidgetController.hide',
    'POST /widget/:id/show': 'WidgetController.show',

    'GET /assets/m/:module/*': 'AssetController.serve'
};
