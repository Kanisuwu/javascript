/*
 * && -> false && true -> false 'O valor mesmo' 
 * || -> false || true -> retorna o primeiro valor verdadeiro.
 * 
 * FALSY VALUES
 * *false
 * 0
 * '' "" ``
 * null
 * Undefined
 * NaN
 * 
 */

console.log('Slugcat' && 'Leech'); // Retorna o último valor.
console.log('Slugcat' && 0 && 'Leech'); // Retorna o valor falso

function oi(){
    return 'Oi';
}

const willExecute = true;

console.log(willExecute && oi());

console.log(0 || null || NaN || 'Slugcat' || true);

const corUsuario = 'red';
const corPadrao = corUsuario || 'preto';

console.log(corUsuario)

const a = 0;
const b = null;
const c = 'false'; // Valor verdadeiro
const d = false;
const e = NaN;

console.log(a || b || c || d || e)