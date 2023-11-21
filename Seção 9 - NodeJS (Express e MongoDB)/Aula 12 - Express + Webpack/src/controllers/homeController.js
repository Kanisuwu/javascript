exports.initial = (req, res) => {
    res.render('index');
}; 

exports.handle = (req, res) => {
    res.send(`New ${req.body.name}`);
};