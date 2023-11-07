// const objA = { // -> Object.prototype
//     keyA: 'A'
//     // __proto__: Object.prototype
// };
// const objB = { 
//     keyB: 'B'
//     // __proto__: objA
// };

// Object.setPrototypeOf(objB, objA);
// console.log(objB.keyA); // objB -> objA -> Object.prototype

function Produto(name, price){
    this.name = name;
    this.price = price;
}

Produto.prototype.sale = function(sale){
    this.price = this.price - (this.price * (sale / 100));
};
Produto.prototype.rise = function(rise){
    this.price = this.price + (this.price * (rise / 100));
};

const p1 = new Produto('PS5', 3500);
const p2 = {
    name: 'Caneca',
    price: 15
};
const p3 = Object.create(Produto.prototype, {
    
});

Object.setPrototypeOf(p2, Produto.prototype);

p1.sale(50);
console.log(p1);
p2.sale(10);
console.log(p2);
console.log(p3);