exports.initial = (req, res) => {
    console.log(req.flash('error'), req.flash('info'), req.flash('success'));
    res.render('index');
    return;
}; 

exports.handle = (req, res) => {
    res.send(`New ${req.body.name}`);
    return;
};