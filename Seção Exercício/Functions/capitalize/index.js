// Write a JavaScript function that accepts a string as a parameter and converts the first letter of each word into upper case.
// Example string : 'the quick brown fox'
// Expected Output : 'The Quick Brown Fox '

const capitalize = (str) => {
    const strArray = str.split(' ');
    const rightArray = [];
    for (let i = 0; i < strArray.length; i++) {
        rightArray.push(strArray[i].charAt(0).toUpperCase() + strArray[i].slice(1));
    }
    return rightArray.join(' ');
};

console.log(capitalize('the quick brown fox'));