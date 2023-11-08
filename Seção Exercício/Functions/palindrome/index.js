// Write a JavaScript function that checks whether a passed string is a palindrome or not.
// A palindrome is word, phrase, or sequence that reads the same backward as forward, e.g., madam or nurses run.

const palindrome = (string) => {
    const lowerString = string.toLowerCase();
    const fullString = lowerString.replace(/\W+/g, '');
    const regex = new RegExp(fullString, 'g');
    const reversedString = fullString.split('').reverse().join('');
    return (reversedString.match(regex)) ? true : false;
};

console.log(palindrome('taco car'));