class Electronic {
    constructor(name) {
        this.name = name;
        this.power = false;
    }
    on() {
        if (this.power === true) { console.log('Already up.'); }
        this.power = true;
    }
    off() {
        if (this.power === false) { console.log('Already off.'); }
        this.power = false;
    }
}

const pc = new Electronic('PC');

class Smartphone extends Electronic {
    constructor(name, color, model) {
        super(name);
        this.color = color;
        this.model = model;
    }
    on() {
        console.log('Poliformism');
    }
}

const s1 = new Smartphone('Samsung', 'Black', 'Galaxy S8');

console.log(s1);

pc.on();
pc.on();
s1.on();