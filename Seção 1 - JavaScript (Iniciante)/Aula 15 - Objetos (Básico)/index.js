// const array = [1, 2, 3];
// array.push(4);
// array[0] = 'Slugcat';

// console.log(array);


// Melhor criar um objeto do que isso aqui.
// const name1 = 'Leech';
// const type1 = 'Water';
// const age1 = 2;

// const name2 = 'Beecat';
// const type2 = 'Air';
// const age2 = 1;


//ISSO É BOM. MAS...
// const pessoa1 = {
//     name: 'Leech',
//     type: 'Water',
//     age: 2
// };

// const pessoa2 = {
//     name: 'Beecat',
//     type: 'Air',
//     age: 1
// };

// Função FACTORY. Ela é uma 'fábrica' de objetos.
// function makePerson(name, type, age){
//     return { name, type, age }
// };

// const slug1 = makePerson('Leech', 'Water', 2);
// const slug2 = makePerson('Beecat', 'Air', 1);

// console.log(slug1.name);
// console.log(slug1.type);
// console.log(slug1.age);
// console.log(slug2.name);
// console.log(slug2.type);
// console.log(slug2.age);

const slug1 = {
    name: 'Leech',
    type: 'Water',
    power: 2,
    speak(){ // Chama a função dentro do próprio objeto sem construtor ou variável.
        console.log(`${this.name}: Hello World!`)
    },
    risePower(){ // Função que incrementa seu próprio valor!
        this.power++ 
    }
};

slug1.speak();
slug1.risePower(); // Chama a função
console.log(slug1.power)