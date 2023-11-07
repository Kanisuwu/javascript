// Retorne números maiores que 10
const numbers = [5, 50, 11, 43, 21, 9, 6, 43, 23, 99, 7, 2, 1, 0];

// const number10s = [];
// for (let value of numbers){
//     if (value > 10){
//         number10s.push(value);
//     }
// }
                                    // callback do filtro
const filteredNumbers = numbers.filter(value => value > 10);

// Filter -> Return an array with the same elements or less...

console.log(filteredNumbers);

// Retorna pessoas com nomes que tenham 5 letras ou mais.
// Retorna pessoas com mais de 50 de poder.
// Retorne as pessoas cujo o nome termina com A.



const persons = [
    {name: 'Slugcat', pow: 12},
    {name: 'Kanisu', pow: 20},
    {name: 'Hunter', pow: 230},
    {name: 'Misuki', pow: 20},
    {name: 'Lexica', pow: 177},
    {name: 'Karsus', pow: 602},
];

const personWithBigNames = persons.filter(value => value.name.length > 6);
const personWithBigPower = persons.filter(value => value.pow > 50);
const personWithA = persons.filter(value => value.name.endsWith('a'));

console.log(personWithBigNames);
console.log(personWithBigPower);
console.log(personWithA);