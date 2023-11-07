// function meuEscopo(){
//     const form = document.querySelector('.form');
//     form.onsubmit = function(event){
//         event.preventDefault();
//         alert(1);
//         console.log('Sent.')
//     };
// }

function makeObject(name, lastName, age, height, weight){
    return {name, lastName, age, height, weight};
};

function meuEscopo(){
    const form = document.querySelector('.form');
    const result = document.querySelector('.resultado');
    const pessoal = [];
    function funcao(event){
        event.preventDefault();
        const nome = form.querySelector('.name');
        const sobrenome = form.querySelector('.last-name');
        const idade = form.querySelector('.age');
        const altura = form.querySelector('.height');
        const peso = form.querySelector('.weight');

        //Poderia ser feito dessa maneira:
        /*  pessoal.push({
            nome: nome.value,
            sobrenome: sobrenome.value,
            idade: idade.value,
            altura: altura.value,
            peso: peso.value
        })
         */

        pessoal.push(makeObject(nome.value, sobrenome.value, idade.value, altura.value, peso.value));
        result.innerHTML += `<p>Seu nome é ${nome.value} ${sobrenome.value}. Você tem ${idade.value} anos, ${altura.value} de altura e ${peso.value} kg.</p>`;

        console.log(pessoal);
    }
    form.addEventListener('submit', funcao);
}

meuEscopo();