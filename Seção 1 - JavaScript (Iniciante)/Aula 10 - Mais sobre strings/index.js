//            01234567      Strings são indexadas na maioria das linguagens!
let string = 'Um texto'; // Pode ser mencionada usando '\' e o caractére para o escape.

console.log(string.charAt(4));
console.log(string[4]);
console.log(string.concat(' em um lindo dia. == CONCAT'));
console.log(string + ' em um lindo dia. == +');
console.log(`${string} em um lindo dia. == Template String`)

console.log(string.indexOf('texto'), '== encontrado no indíce 3.');
console.log(string.lastIndexOf('t'));
console.log(string.match(/[a-z]/g)); // Expressão regular. Ainda não vi sobre.
console.log(string.search(/[a-z]/g));
console.log(string.search(/t/));
console.log(string.replace('Um', 'Nenhum')); // Aceita expressões regulares.

const string2 = 'O rato roeu a roupa do rei de roma.'

console.log(string2.replace(/r/g, 'c'));
console.log(string2.length);
console.log(string2.slice(-5, -1)); // Se você usar números negativos ele irá subtrair do total do tamanho da string.
console.log(string2.substring(string2.length - 5, string2.length - 1)); // mesma coisa que slice, porém pior.

console.log(string2.split(' ', 3));

console.log(string2.toLowerCase());
console.log(string2.toUpperCase());