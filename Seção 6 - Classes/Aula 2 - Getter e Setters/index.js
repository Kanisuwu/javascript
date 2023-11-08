const _acceleration = Symbol('acceleration');
class Car {
    constructor(name) {
        this.name = name;
        this[_acceleration] = 0;
    }
    set acceleration(value) {
        if (typeof value !== 'number') return;
        if (value > 100 || value < 0) return;
        this[_acceleration] = value;
    }
    get acceleration() {
        return this[_acceleration];
    }
    accelerate() {
        if (this[_acceleration] >= 100) return;
        this[_acceleration]++;
    }
    stop() {
        if (this[_acceleration] === 0) return;
        this[_acceleration]--;
    }
}

const car = new Car('Ferrari');

// for (let i = 0; i < 200; i++) {
//     car.accelerate();
// }

car.acceleration = 99;

console.log(car.acceleration);