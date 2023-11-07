// const tresHoras = 60 * 60 * 3 * 1000;
// let data = new Date(); // Função construtora sempre começa com letra Maiúscula
// data = new Date(0 + tresHoras); // 01/01/1970 --> Timestamp Unix OU Era Unix

// console.log(data);

// let data = new Date(2020, 3, 7, 12); // Se tiver um argumento ele considera como milésimos de segundos. A, M, D, H, M, S, MS
// data = new Date('2020-04-07T12:00:00');
// console.log(data.toString());

// console.log('Dia', data.getDate());
// console.log('Mês', data.getMonth()); // Mês começa do 0.
// console.log('Ano', data.getFullYear());
// console.log('Hora', data.getHours());
// console.log('Min', data.getMinutes());
// console.log('Seg', data.getSeconds());
// console.log('ms', data.getMilliseconds());
// console.log('Dia da Semana', data.getDay()); // 0 a 6

// console.log(Date.now()) // Devolve os ms de desde 01/01/1970 até hoje.

function zeroToLeft(num){
    return num >= 10 ? num : `0${num}`;
}

function formatDate(data){
    const day = zeroToLeft(data.getDate());
    const month = zeroToLeft(data.getMonth() + 1);
    const year = zeroToLeft(data.getFullYear());
    const hour = zeroToLeft(data.getHours());
    const min = zeroToLeft(data.getMinutes());
    const sec = zeroToLeft(data.getSeconds());

    return `${day}/${month}/${year} | ${hour}:${min}:${sec}`;
}

const data = new Date();
const dataBrasil = formatDate(data);
console.log(dataBrasil);