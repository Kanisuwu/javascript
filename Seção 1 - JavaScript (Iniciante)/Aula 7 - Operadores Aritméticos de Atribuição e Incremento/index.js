/* OPERADORES ARITMÉTICOS
 * + Adição e Concatenação
 * - Subtração
 * / Divisão
 * * Multiplicação
 * ** Potenciação.
 * % Resto da Divisão
 * OPERADORES DE ATRIBUIÇÃO
 * ++ Incremento
 * -- Decremento
 * ++variável Pré-incremento
 * --variável Pós-decremento
 * += Adição direta
 * *= Multiplicação direta
 * **= Potenciação direta
 * /= Divisão direta.
 * %= Resto Direto.
 */

const num1 = 10;
const num2 = 5;

console.log(num1 + num2, 'Adição');

console.log(num1 * num2, 'Multiplicação');

console.log(num1 / num2, 'Divisão');

console.log(num1 % num2, 'Resto');

console.log(2 ** 6, 'Potenciação');

let contador = 1;
contador++; // Mesma coisa que 'contador = contador + 1;'
console.log(contador, 'Incremento++');
contador--;
console.log(contador, 'Decremento--');
const passo = 2;
contador += passo; // Mesma cooisa que 'contador = contador + passo;'
console.log(contador, '+=');
contador *= 2; // Mesma coisa que 'contador = contador * 2;'
console.log(contador, '*=');

let nome1 = parseInt('Kanisu'); // Converter um número em string para inteiro (Number)
let num3 = 10;
console.log(nome1 * num3, '= Erro de Not a Number'); // NaN = Not a Number; Erro no cálculo.
// parseInt() e parseFloat(). Caminho mais curto: Number()
const numero1 = parseInt('5');
const numero2 = 10;

console.log(numero1 + numero2, '= parseint()')