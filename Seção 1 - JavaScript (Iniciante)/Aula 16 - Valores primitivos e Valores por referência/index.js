/*  Primitivos (Imutáveis) = String, Number, Boolean, Undefined
 *  Null (bigint, symbol)
 * 
 *  
 * 
 */

let name = 'Slugcat';
name[0] = 'R'
console.log(name[0]) // ---> Will return 'S' because you can't modify primitive data.

let a = 'A';
let b = a; // Cópia

console.log(a, b);

a = 'C';

console.log(a, b);

// Referência - Object, Array and Function

let array1 = [1, 2, 3];
let array2 = array1;
console.log(array1, array2);

array1.push(4);
console.log(array1, array2);