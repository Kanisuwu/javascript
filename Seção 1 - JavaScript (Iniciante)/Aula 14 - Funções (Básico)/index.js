function hello(nome){
    // console.log(`Olá ${nome}!`) // retorna valor nenhum, somente exibe.
    return `Olá ${nome}!`; // Retorna um valor que pode ser 'capturado' por variáveis.
}

const valor = hello('Leech');
console.log(valor, '= Valor retornado da função.');

function soma(x = 1, y = 1){ // Deixa X e Y como valores padrões que podem ser alterados.
    result = x + y; // Soma X e Y e a variável 'result' captura o resultado.
    return result; // Retorna o valor da variável resultado.
};

const calculate = soma(2, 2); // Capturou o valor que é retornado da função com parâmetros de 2 e 2.
console.log(calculate);



const raiz = function(n){ // Função anônima. Ela deve ser declada por via de uma variável. Note que ela DEVE terminar com ';'.
    return n ** 0.5;
};

console.log(`Sqrt: ${raiz(25)}`);

const power2 = n => n ** 2; 

console.log(`Power: ${power2(2)}`)