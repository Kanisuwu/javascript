const name = 'Kanisu';
const level = 5;

const sayLevel = (lvl) => {
    console.log(level);
};

// module.exports.name = name;
// module.exports.level = level;
// module.exports.sayLevel = sayLevel;

exports.name = name;
exports.level = level;
exports.sayLevel = sayLevel;
this.anything = 'Anything';

// console.log(exports);