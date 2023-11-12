const name = 'Kanisu';
const technique = 'Infinity';

function sum(x, y) {
    return x + y;
}

export class Person {
    constructor(firstname, lastname, age) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
    }
}

export { name as ame, sum as default };