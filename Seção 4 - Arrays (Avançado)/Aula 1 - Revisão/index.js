// Reference Values
const fruits = ['Apple', 'Pineapple', 'Lemon']; // Array Literal
const numbers = new Array(1, 2, 3, 4, 5);
fruits[2] = 'Kiwi';
delete fruits[0]; // Removes Apples to empty item
console.log(fruits);
console.log(numbers);

const novo = [...fruits];
novo.pop()
novo.shift()
console.log(novo);

const newNumber = numbers.slice(1, 3);
console.log(newNumber);

const name = 'Hunter Slugcat';
const names = name.split(' ');

const naming = ['Slug', 'cat'];
const namings = naming.join('');

console.log(namings);