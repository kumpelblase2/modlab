module.exports = function (req, res, next) {

    if (!sails.app.installation.finished) {
        return next();
    }

    return res.notFound('Error.Authorization.NotAuthorized');
};
