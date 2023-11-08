// Write a JavaScript program to check a pair of numbers.
// Return true if one of the numbers is 50 or if their sum is 50.

const num1 = 20;
const num2 = 25;

const isFithtnum2 = () => {
    if (num1 === 50 || num2 === 50) {
        return true;
    }
    if (num1 + num2 === 50) {
        return true;
    }
};

console.log(isFithtnum2());