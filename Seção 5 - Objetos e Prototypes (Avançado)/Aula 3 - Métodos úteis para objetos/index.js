const produto = {nome: 'Produto', preco: 1.8};
const caneca = Object.assign({}, produto, {material: 'Steel'}); // Object.assign

console.log(Object.getOwnPropertyDescriptor(produto, 'nome')); // Object.getOwnPropertyDescriptor(obj, key)

console.log(Object.values(produto)); // Object.values != Object.keys
console.log(Object.entries(produto)); // Object.values && Object.keys

for (let [key, value] of Object.entries(produto)){
    console.log(key, value);
}