function rand(min, max) {
    min *= 1000;
    max *= 1000;
    return Math.floor(Math.random() * (max - min) + min);
}

// Promises instead of callback hell
function esperaAi(msg, tempo) {
    return new Promise((resolve, reject) => {
        if (typeof msg !== 'string') reject(new Error('Message is not a string'));
        setTimeout(() => {
            resolve(msg);
        }, tempo);
    });
}

esperaAi('1', rand(1, 3)).then(msg => {
    console.log(msg);
    return esperaAi('2', rand(1, 3));
}).then(msg => {
    console.log(msg);
    return esperaAi('3', rand(1, 3));
}).then(msg => {
    console.log(msg);
}).catch(e => {
    console.log('Erro:', e);
});