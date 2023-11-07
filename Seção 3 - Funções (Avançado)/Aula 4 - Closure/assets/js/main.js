// Global Scope
function retornaFuncao(nome){
    // Script Scope
    // Closure Scope
    return function () { // Closure é a capacidade de acessar o seu escopo léxico
        return nome;
    }
}

const func = retornaFuncao('Kanisu');
const func2 = retornaFuncao('Slugcat');
console.dir(func);
console.dir(func2);