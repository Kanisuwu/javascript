// Write a JavaScript program to compute the absolute difference between a specified number and 19.
// Returns triple the absolute difference if the specified number is greater than 19.

const specifiedNum = 40;

let absoluteDiff = Math.abs(specifiedNum - 19);

if (specifiedNum > 19) {
    absoluteDiff *= 3;
}

console.log(absoluteDiff);