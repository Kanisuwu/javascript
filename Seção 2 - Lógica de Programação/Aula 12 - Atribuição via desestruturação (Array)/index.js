// let a = 'A';
// let b = 'B';
// let c = 'C';

// Desestruturação = Array; Reatribuindo o valor delas.
// [a, b, c] = [b, c, a];

// console.log(a, b, c);

// const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// console.log(nums[0]);

// // Existe o Rest Operator (Abaixo) e o Spread Operator
// const [firstNum, secondNum, ...resto] = nums; // Atribuí o valor do i[0] e i[1] do array 'nums' em ordem da esquerda para direita.

// console.log(firstNum, secondNum, resto);

const array = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

console.log(array[0][0])

const [, , [, , nove]] = array;

console.log(nove);