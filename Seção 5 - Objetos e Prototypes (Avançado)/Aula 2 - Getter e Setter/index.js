function Produto(nome, preco, estoque){
    this.nome = nome;
    this.preco = preco;
    let privateEstoque = estoque;
    Object.defineProperty(this, 'estoque', {
        enumerable: true, //mostra a chave sobre iterações
        configurable: true, // Pode reconfigurar a chave
        get: function(){
            return privateEstoque;
        },
        set: function(value){
            //this.estoque pode criar um loop.
            if (typeof value !== 'number'){
                throw new TypeError('value must be number');
                return;
            }
            privateEstoque = value;
        }
    })
}

const p1 = new Produto('Camiseta', 20, 100);

console.log(p1);
console.log(p1.estoque);

function makePro(name){
    return {
        get name(){
            return name;
        },
        set name(value){
            name = value;
        }
    };
}

const phone = makePro('phone');
phone.name = 'Cerura';
console.log(phone.name);