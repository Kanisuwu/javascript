// const slug = ['Slugcat', 'Slug', 'Cat'];

// // for (let value of slug){
// //     console.log(value);
// // }

// slug.forEach(function(value, index, array){ // Maneira melhor se for de boa com funções.
//     console.log(index, value, array)
// })

const person = {
    name: 'Kanisu',
    lastname: 'Mitsuki',
    age: 20
};

for (let i in person) {
    console.log(person[i]);
}

// For Clássico - Geralmente interáveis com Arrays e Strings.
// For In - Retorna o índice ou chave. (Arrays, Strings ou Objetos)
// For of - Retorna o valor. (Arrays, Strings ou Iteráveis. OBJETOS NÃO SÃO ITERÁVEIS.)
