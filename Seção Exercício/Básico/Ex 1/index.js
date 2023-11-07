const date = new Date();

const dateFormat = Intl.DateTimeFormat('pt-BR', {weekday: 'long', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric'}).format()

const dateArray = dateFormat.split(',');

const weekday = dateArray.shift();
const hours = dateArray.join().trimStart();

console.log(`Hoje é: ${weekday}`);
console.log(`Horário atual é: ${hours}`);