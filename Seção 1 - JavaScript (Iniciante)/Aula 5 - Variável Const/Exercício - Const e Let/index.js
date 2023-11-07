const nome = 'Kanisu';
const sobrenome = 'Bassani';
const altura = 1.90;
const peso = 95;
const idade = 20;
let imc = peso / (altura * altura);
let anoNascimento = 2003;
console.log(nome, sobrenome, 'tem', idade, 'anos,', 'pesa', peso, 'kg.');
console.log(`Tem ${altura} de altura e seu IMC é de ${imc}`) // Maneira mais legível de se ler.
console.log(`${nome} nasceu em ${anoNascimento}`);