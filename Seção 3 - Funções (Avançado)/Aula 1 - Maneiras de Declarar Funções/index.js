// Declaração de Função (Function Hoisting);
hi();
function hi(){
    console.log('Hi');
}

// First-Class Objects
const iamData = function(){
    console.log('Data');
};
function executeFunc(func){
    func();
}
executeFunc(iamData);

// Arrow Function (ES6-2015)
const arrow = () => {
    console.log('Arrow Function');
};

arrow();

// Dentro de um Objeto.
const obj = {
    talk(){
        console.log('Falando...');
    }
};
obj.talk();


