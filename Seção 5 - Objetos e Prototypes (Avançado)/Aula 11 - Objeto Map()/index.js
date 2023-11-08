const persons = [
    { id:3, name: 'Slugcat' },
    { id:2, name: 'Kanisu' },
    { id:1, name: 'Crunchycat' },
];

// const newPersons = {};
const newPersons = new Map();
for (const pessoa of persons) {
    const { id } = pessoa;
    newPersons.set(id, { ...pessoa });
}

console.log(newPersons);