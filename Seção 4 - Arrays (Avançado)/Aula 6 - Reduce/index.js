const numbers = [5, 50, 11, 43, 21, 9, 6, 43, 23, 99, 7, 2, 1, 0];



const persons = [
    {name: 'Slugcat', pow: 22},
    {name: 'Kanisu', pow: 20},
    {name: 'Hunter', pow: 21},
    {name: 'Mitsuki', pow: 44},
    {name: 'Lexica', pow: 421},
    {name: 'Karsus', pow: 602},
];

const powerful = persons.reduce((acc, curV) => {
    console.log(acc, curV);
    if (acc.pow > curV.pow){return acc;}
    return curV // Acumulador adota o valor de curV.
})

console.log(powerful);