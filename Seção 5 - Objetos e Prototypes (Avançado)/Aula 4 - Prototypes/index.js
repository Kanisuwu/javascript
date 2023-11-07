function Pessoa(nome, sobrenome){
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.nomeCompleto = () => `${nome} ${sobrenome}`;
}

Pessoa.prototype.estouAqui = 'Hahaha';

const p1 = new Pessoa('Slugcat', 'Catish');
const p2 = new Pessoa('Kanisu', 'Mitsuki');

const data = new Date();

console.dir(p1);
console.dir(p2);
console.dir(data);