const HomeModel = require('../models/HomeModel');

// HomeModel.create({
//     title: 'A title for tests',
//     description: 'A TEST!'
// })
HomeModel.find()
    .then(data => console.log(data))
    .catch(e => console.log(e));

exports.initial = (req, res) => {
    res.render('index');
}; 

exports.handle = (req, res) => {
    res.send(`New ${req.body.name}`);
};