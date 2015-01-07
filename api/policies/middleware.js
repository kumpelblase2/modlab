module.exports = function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    _.extend(res.locals, HelperService);
    next();
};
