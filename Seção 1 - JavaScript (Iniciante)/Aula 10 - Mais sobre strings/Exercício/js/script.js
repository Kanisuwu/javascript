const nome = prompt('Digite o Seu Nome.');
const tamanhoDoNome = nome.length
const segundaLetraDoNome = nome.charAt(1);
const ultimoIndexDoNome = nome.lastIndexOf('i');
const primeiroIndexDoNome = nome.indexOf('i');
const palavrasDoNome = nome.split(' ');
const ultimasTresLetrasDoNome = nome.slice(-3);
const nomeMinusculo = nome.toLowerCase();
const nomeMaiusculo = nome.toUpperCase();


document.body.innerHTML += `Seu nome é: ${nome}<br />`;
document.body.innerHTML += `Seu nome tem ${tamanhoDoNome} letras <br />`;
document.body.innerHTML += `A segunda letra do seu nome é: ${segundaLetraDoNome}<br />`;
document.body.innerHTML += `Qual o último índice da letra i no seu nome? ${ultimoIndexDoNome}<br />`;
document.body.innerHTML += `Qual o primeiro índice da letra i no seu nome? ${primeiroIndexDoNome}<br />`;
document.body.innerHTML += `As palavras do seu nome são: ${palavrasDoNome}<br />`;
document.body.innerHTML += `As últimas 3 letras do seu nome são: ${ultimasTresLetrasDoNome}<br />`;
document.body.innerHTML += `Seu nome com letras minúsculas: ${nomeMinusculo}<br />`;
document.body.innerHTML += `Seu nome com letras maiúsculas: ${nomeMaiusculo}<br />`;