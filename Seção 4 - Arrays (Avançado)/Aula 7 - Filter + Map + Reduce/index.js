const numbers = [5, 50, 11, 43, 21, 9, 6, 43, 23, 99, 7, 2, 1, 0];

const sumAll = numbers
    .filter(value => {
        if (value % 2 === 0){
            return value;
    }})
    .map(value => {
        return value * 2;
    })
    .reduce((acc, value) => {
        return acc + value;
    });

console.log(sumAll);