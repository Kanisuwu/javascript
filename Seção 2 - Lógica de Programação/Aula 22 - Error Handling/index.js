try {
    console.log(doNotExist);
} catch(err) {
    console.log('Variável Não Existe.')
}

function soma(x, y){
    if (typeof x !== 'number' || typeof y !== 'number') {
        throw ("X e Y precisam ser positivos.")
    }else{
        return x + y;
    }
}

try {
    console.log(soma(1, 1));
    console.log(soma(1, 'a'));
} catch(error) {
    console.log(error)
}

try {
    console.log('Abri um arquivo');
    console.log('Manipulei um arquivo e deu erro');
    console.log('Fechei o arquivo'); // Não fecharia em caso de erro
} catch(err) {
    console.log('Tratando o erro');
} finally {
    console.log('Eu sempre sou executado.')
}

function retornaData(data){
    if (data && !(data instanceof Date)){
        throw new TypeError('Esperando instancia de Date')
    }
    if (!data) {
        data = new Date()
    }
    return data.toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

try {
    const data = new Date('01-01-1970 12:58:12')
    const hora = retornaData(data);
    console.log(hora);
} catch(err) {
    console.log(err);
}finally{
    console.log('Horário Final.')
}

