// Return
// Termina a função
// Retorna um valor

function soma(a, b){
    return a + b;
}

function criaPessoa(nome, idade){ // Retorna um Objeto Literal
    return {
        nome, idade
    }
}

p1 = criaPessoa('Kanisu', 20);

function falaFrase(comeco){
    function falaResto(resto){
        return comeco + ' ' + resto
    }
    return falaResto;
}

const olaMundo = falaFrase('Olá');
console.log(olaMundo('mundo'));

function makeMultiply(m){
    return function(n){ // Closure Function
        return n * m;
    }
}

const duplica = makeMultiply(2);

console.log(duplica(2));