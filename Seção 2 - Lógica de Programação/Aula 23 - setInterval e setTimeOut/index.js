function mostraHora(){
    let data = new Date();
    return data.toLocaleTimeString('pt-BR', {
        hour12: false
    });
}


const tempoAntigo = mostraHora();
const timer = setInterval(function(){
    console.log(mostraHora());
}, 1000); // Precisa-se da referência da função [, tempo em milissegundos]

setTimeout(function(){
    clearInterval(timer);
}, 5000)