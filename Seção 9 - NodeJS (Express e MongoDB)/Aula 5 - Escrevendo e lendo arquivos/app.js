const path = require('path');
const write = require('./modules/write');
const read = require('./modules/read');
// const pathing = path.resolve(__dirname, '..', 'test.txt');
const pathing = path.resolve(__dirname, 'test.json');

const persons = [
    {name: 'Mitsuki'},
    {name: 'Letícia'},
    {name: 'Slugcat'},
    {name: 'Kanisu'},
    {name: 'Bunro'},
];

const json = JSON.stringify(persons, '', 2);
write(pathing, json);

async function readFile(paths) {
    const data = await read(paths);
    return renderData(data);
};

function renderData(data) {
    const parsedData = JSON.parse(data);
    return parsedData;
}

(async () => {
    const arrayObj = await readFile(pathing);
    console.log(arrayObj)
})();
