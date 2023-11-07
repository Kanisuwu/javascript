/*  Operadores de Comparação
 *  > Maior que.
 *  < Menor que.
 *  >= Maior ou igual a.
 *  <= Menor ou igual a.
 *  == Igualdade (= atribuição) / (Compara valores) ******************** Não recomendado
 *  === Estrita igualdade. (Compara ambos valores e tipos)
 *  != Diferença. (Valor) ********************* Não recomendado
 *  !== Diferença estrita. (Valor e tipo)
 */

let num1 = 10;
let num2 = '10';

const comp = num1 === num2;
const comp1 = num1 != num2;
const comp2 = num1 !== num2;

console.log(comp);
console.log(comp1);
console.log(comp2);