const fs = require('fs').promises;


// flag: w | Always erase and write the file.
// flag: a | awayts write on the file.
module.exports = (pathing, data) => {
    fs.writeFile(pathing, data, { flag: 'w' });
};

