const array = ['A', 'B', 'C', 'D', 'E', 'F']
let i = 0;

while (i < 6) {
    console.log(i, array[i]);
    i++
}

function random(min, max){
    const r = Math.random() * (max - min) + min;
    return Math.floor(r);
}

const min = 1;
const max = 20;
let rand = 10;
console.log(rand);

while (rand !== 10) { // Checa primeiro executa depois.
    console.log(rand);
}

console.log('#######')

do { // Executa primeiro e checa depois.
    rand = random(min, max);
    console.log(rand);
} while (rand !== 10);