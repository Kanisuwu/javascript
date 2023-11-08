// Write a JavaScript function that generates all combinations of a string.
// Example string : 'dog'
// Expected Output : d,do,dog,o,og,g

const possibleCombination = (word) => {
    const combinations = [];
    for (let i = 0; i < word.length; i++) {
        for (let j = i + 1; j < word.length + 1; j++) {
            combinations.push(word.slice(i, j));
        }
    }
    return combinations;
};

console.log(possibleCombination('Apple'));