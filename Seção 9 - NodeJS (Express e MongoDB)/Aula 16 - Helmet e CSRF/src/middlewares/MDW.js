exports.checkCsrfError = (err, req, res) => {
    if(err && err.code === 'EBADCSRFTOKEN') {
        return res.render('./includes/404');
    }
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};