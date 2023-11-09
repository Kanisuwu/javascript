function rand(min, max) {
    min *= 1000;
    max *= 1000;
    return Math.floor(Math.random() * (max - min) + min);
}

// Promises instead of callback hell
function esperaAi(msg, tempo) {
    return new Promise((resolve, reject) => {
        if (typeof msg !== 'string') {
            reject(false);
            return;
        }
        setTimeout(() => {
            resolve(msg);
        }, tempo);
    });
}

const promises = [
    'Primeiro Valor',
    esperaAi('Promise 1', rand(1, 5)),
    esperaAi('Promise 2', rand(1, 5)),
    esperaAi('Promise 3', rand(1, 5)),
    esperaAi(3, 1000),
    'Outro valor',
];
// All = Resolve everything.
// Race = Resolve only the first value.
// Resolve = Resolve the promise without the need of avaliation.
// Reject = Reject the promise withou the need of avaliation.
Promise.all(promises).then(value => {
    console.log(value);
}).catch(e => {
    console.log('Error >>>', e);
});