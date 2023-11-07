// produto -> rise/sale
// Camiseta = Cor, Caneca = Material
function Produto(name, price){
    this.name = name;
    this.price = price;
}

Produto.prototype.rise = function(rise){
    this.price += rise;
}
Produto.prototype.sale = function(sale){
    this.price -= sale;
}

function Shirt(name, price, color){
    this.color = color;
    Produto.call(this, name, price)
}

function Cup(name, price, material, stock){
    this.material = material;
    Produto.call(this, name, price);
    Object.defineProperty(this, 'stock', {
        get: function(){
            return stock;
        },
        set: function(value){
            if (typeof value !== 'number') return;
            stock = value;
        },
        configurable: false,
        enumerable: true
    })
}

Shirt.prototype = Object.create(Produto.prototype);
Shirt.prototype.constructor = Shirt;
Cup.prototype = Object.create(Produto.prototype);
Cup.prototype.constructor = Cup;

Cup.prototype.sale = function(sale){
    this.price = this.price - (this.price * (sale / 100));
}

const shirt = new Shirt('Regata', 7.5, 'black');
const cup = new Cup('Viking', 5, 'Redwood', 120);

shirt.sale(6.5);
cup.sale(10);

console.log(shirt);
console.log(cup);
console.log(cup.stock);