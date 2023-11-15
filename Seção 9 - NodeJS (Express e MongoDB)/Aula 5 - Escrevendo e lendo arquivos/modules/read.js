const fs = require('fs').promises;

// REMEMBER TO NOTICE THE CLOSURE OF THE FUNCTIONS!
module.exports = (pathing, callback) => {
    return fs.readFile(pathing, 'utf8', callback);
};
