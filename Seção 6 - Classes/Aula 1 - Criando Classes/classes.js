class Person {
    constructor(name, lastname) {
        this.name = name;
        this.lastname = lastname;
    }
    talk() {
        console.log(`${this.name} is talking.`);
    }
    jump() {
        console.log(`${this.name} jumped.`);
    }
}

const p1 = new Person('Slugcat', 'Catish');
console.log(p1);