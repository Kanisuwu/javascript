// defineProperty / defineProperties;
function Produto(nome, preco, estoque){
    Object.defineProperty(this, 'estoque', {
        enumerable: true, //mostra a chave sobre iterações
        value: estoque, // valor
        writable: false, // Valor alterável
        configurable: true // Pode reconfigurar a chave
    })
    Object.defineProperties(this, {
        nome: {
            enumerable: true, //mostra a chave sobre iterações
            value: nome, // valor
            writable: true, // Valor alterável
            configurable: true // Pode reconfigurar a chave
        },
        preco: {
            enumerable: true, //mostra a chave sobre iterações
            value: preco, // valor
            writable: true, // Valor alterável
            configurable: true // Pode reconfigurar a chave
        }
    })
}

const p1 = new Produto('Camiseta', 20, 100);

console.log(p1.nome);