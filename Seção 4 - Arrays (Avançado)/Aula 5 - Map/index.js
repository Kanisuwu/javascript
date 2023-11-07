// Dobre os Números

const numbers = [5, 50, 11, 43, 21, 9, 6, 43, 23, 99, 7, 2, 1, 0];

const numDouble = numbers.map(value => value * 2);

console.log(numDouble);



const persons = [
    {name: 'Slugcat', pow: 12},
    {name: 'Kanisu', pow: 20},
    {name: 'Hunter', pow: 230},
    {name: 'Mitsuki', pow: 20},
    {name: 'Lexica', pow: 177},
    {name: 'Karsus', pow: 602},
];

const onlyString = persons.map(obj => obj.name);
//const withoutName = persons.map(obj => delete obj.name);
const withoutName = persons.map((obj) => ({pow: obj.pow}));
const withID = persons.map((obj, index) => {
    const newObj = { ...obj };
    newObj.id = index;
    return newObj;
});

console.log(persons);
console.log(onlyString);
console.log(withoutName);
console.log(withID);