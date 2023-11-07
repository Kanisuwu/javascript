// variável especial: arguments. Sustenta todos os argumentos enviados pra função.
// function func(a, b, c){ 
//     let result = 0;
//     for (let argument of arguments){ // sustenta TODOS os argumentos enviados para funções com FUNCTION.
//         result += argument;
//     }
//     console.log(result);
// }

// func(1, 2, 3, 4, 5); // Não lança erros por ser construída pelo meio *function*.

// function func(a, b = 2, c = 0){ // Declara as variáveis não especificadas como UNDEFINED.
//     // b = b || 0;
//     console.log(a + b + c);
// }

// func(2, undefined, 2);

// function func({nome, sobrenome, idade}){ // Atribuição via desestruturação
//     console.log(nome, sobrenome, idade);
// }
// func({nome: 'Kanisu', sobrenome: 'Mitsuki', idade: 20});

// function func([v1, v2, v3]){
//     console.log(v1, v2, v3);
// }
// let array = [1, 2 ,3]
// func(array);

// function calc(operator, acumulator, ...numbers){ // rest operator. Sempre deve ser o último parâmetro da função.
//     for (let num of numbers){
//         if (operator === '+') {acumulator += num;}
//         if (operator === '-') {acumulator -= num;}
//         if (operator === '*') {acumulator *= num;}
//         if (operator === '/') {acumulator /= num;}
//     }
//     console.log(acumulator);
// }

// calc('*', 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

const func = (...args) => { // USE SEMPRE REST OPERATOR, pois ele funciona em todas as funções, diferente de *arguments*.
    console.log(args);
}

func(1, 2, 3, 'A', 'B', 'C');