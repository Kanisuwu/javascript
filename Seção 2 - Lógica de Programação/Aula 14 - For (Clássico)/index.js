// No good
// console.log('Linha 0');
// console.log('Linha 1');
// console.log('Linha 2');
// console.log('Linha 3');
// console.log('Linha 4');
// console.log('Linha 5');

//  Declaração | Condição | Incremento { BLOCO }

//                 0       1      2        3          4
const frutas = ['Maçã', 'Pera', 'Uva', 'Abacaxi', 'Banana'];

for (let i = 0; i < frutas.length; i++) {
    console.log(`Elemento ${i + 1}:`, frutas[i]);
}