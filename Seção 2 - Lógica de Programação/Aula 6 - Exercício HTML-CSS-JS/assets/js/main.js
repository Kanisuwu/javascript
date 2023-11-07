
const previneEvento = (e) => {
    e.preventDefault()
    console.log('Evento Previnido.')
    displayResult();
}

function calculaIMC(peso, altura){
    const imc = Number((peso / (altura ** 2)).toFixed(1));
    console.log(`IMC: ${imc}`)
    return imc;
}

function gravidadeDoPeso(imc){
    const nivel = [
        'Abaixo do peso',
        'Peso normal',
        'Sobrepeso',
        'Obesidade Grau I',
        'Obesidade Grau II',
        'Obesidade Grau III'
    ]
    if (imc >= 39.9) return nivel[5];
    if (imc >= 34.9) return nivel[4];
    if (imc >= 29.9) return nivel[3];
    if (imc >= 24.9) return nivel[2];
    if (imc >= 18.5) return nivel[1];
    if (imc < 18.5) return nivel[0];
    if (!imc) return false;
}

function checaPesoAltura(weight, height){
    let erro = false;
    if (!weight || !height){
        erro = true;
    }
    console.log(`Erro: ${erro}`)
    return erro
}

function corDoPeso(gravidade){
    const cores = [
        'Abaixo do peso',
        'Peso normal',
        'Sobrepeso',
        'Peso Inválido',
        'Altura Inválida',
        'Erro Desconhecido'
    ]

    if (!gravidade){
        color = 'salmon';
    }else if(gravidade === cores[1]){
        color = 'green';
    }else if(gravidade === cores[2]){
        color = 'yellow';
    }else{
        color = 'red';
    }
    console.log(`Gravidade: ${gravidade} | cor: ${color}.`);
    return color;
}

function setError(weight, height){
    const errorTypes = [
        'Peso Inválido',
        'Altura Inválida',
    ]
    if (!weight) return errorTypes[0];
    if (!height) return errorTypes[1];
}

function constroiDisplay(cor, imc, gravidade, error){
    const notify = document.querySelector('.notification');

    notify.style.background = cor;
    notify.style.padding = '3px 0';
    notify.style.display = 'flex';
    notify.style.justifyContent = 'center';

    if (!imc){
        notify.innerHTML = `<p>${error}.</p>`;
    } else {
        notify.innerHTML = `<p>Seu IMC é ${imc}. ${gravidade}.</p>`;
    }
}

function displayResult(){
    const form = document.querySelector('#form');
    const weight = Number(form.querySelector('#weight').value);
    const height = Number(form.querySelector('#height').value);

    const imc = calculaIMC(weight, height);

    const gravidade = gravidadeDoPeso(imc);
    const check = checaPesoAltura(weight, height);
    const error = setError(weight, height);
    const cor = corDoPeso(gravidade || !check);

    constroiDisplay(cor, imc, gravidade, error);
    
}

function main(){
    form.addEventListener('submit', previneEvento)
}

main();
