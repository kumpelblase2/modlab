module.exports = function (req, res, next) {
    _.extend(res.locals, HelperService);
    next();
};
