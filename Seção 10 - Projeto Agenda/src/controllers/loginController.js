const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if (req.session.user) return res.render('logged');
    res.render('login');
};

exports.register = (async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                console.log(login.errors);
                return res.redirect('index');
            });
            return;
        }
        req.flash('success', 'Registration is done.');
        req.session.save(() => {
            return res.redirect('index');
        });
    }
    catch (e) {
        console.log(e);
        return res.render('404');
    }
});

exports.login = (async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.log();

        // Error handler
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('index');
            });
            return;
        }
        req.session.user = login.user;
        req.session.save(() => {
            return res.redirect('index');
        });
    }
    catch (e) {
        console.log(e);
        return res.render('404');
    }
});

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};