const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
});

const HomeModel = mongoose.model('Home', HomeSchema);

// Usually we work with classes.
class Home {

}

module.exports = HomeModel;