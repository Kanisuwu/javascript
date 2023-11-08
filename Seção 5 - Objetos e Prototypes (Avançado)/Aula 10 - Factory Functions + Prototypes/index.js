// Este tipo de estrutura é chamada de composição (Ou mixing).
const talk = {
    talk() {
        console.log(`${this.name} is talking.`);
    },
};
const walk = {
    walk() {
        console.log(`${this.name} is walking.`);
    },
};
const jump = {
    jump() {
        console.log(`${this.name} jumped.`);
    },
};

// const personPrototype = { ...talk, ...walk, ...jump };
const personPrototype = Object.assign({}, talk, walk, jump);

function makePerson(name, lastname) {
    return Object.create(personPrototype, {
        name: { value: name },
        lastname: { value: lastname },
    });
}

const p1 = makePerson('Slugcat', 'Catish');
console.log(p1);