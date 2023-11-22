exports.initial = (req, res) => {
    res.render('index', {
        title: 'EJS Initial Title',
    });
    return;
}; 

exports.handle = (req, res) => {
    res.send(`New ${req.body._csrf}`);
};