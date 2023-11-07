const array = ['Kanisu', 'Slugcat', 'NSH'];
console.log(array);
console.log(array[0]); // Busca por índice.

array[0] = 'Leech'; // Alteração do valor.
console.log(array);
console.log(array.length);

// array[array.length] = 'Kanisu';
// array[array.length] = 'Beecat';
array.push('Kanisu') // Preferível em vez do acima.
console.log(array);

array.unshift('Beecat'); // O método aqui adiciona no índice 0.
console.log(array)

let removido = array.pop(); // remove o último elemento.
let removido2 = array.shift(); // remove do primeiro elemento.
console.log(array, removido, removido2)

delete array[2]; // Deleta um item sem mudar o flow.
console.log(array);

array[2] = 'SRS';

console.log(array.slice(0, 3)); // Corta uma array semelhante feito com strings anteriormente.
console.log(array instanceof Array);