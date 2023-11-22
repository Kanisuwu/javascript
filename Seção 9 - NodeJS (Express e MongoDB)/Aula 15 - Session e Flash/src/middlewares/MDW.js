exports.middleWareGlobal = (req, res, next) => {
    res.locals.variable = 'A middleware variable';
    next();
};