// Write a JavaScript program to check whether a given integer is within 20 of 100 or 400.

const num = 80;

const isWithin = x => {
    const result = x === (100 * 0.2) ? true : (x === (400 * 0.2));
    return result;
};

console.log(isWithin(num));