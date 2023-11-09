function rand(min = 1, max = 3) {
    min *= 1000;
    max *= 1000;
    return Math.floor(Math.random() * (max - min) + min);
}

// Promises instead of callback hell
function esperaAi(msg, tempo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof msg !== 'string') {
                reject(false);
                return;
            }
            resolve(msg);
        }, tempo);
    });
}

// esperaAi('Phase 1', rand())
//     .then(value => {
//         console.log(value);
//         return esperaAi('Phase 2', rand());
//     })
//     .then(value => {
//         console.log(value);
//         return esperaAi('Phase 3', rand());
//     })
//     .then(value => {
//         console.log(value);
//     })
//     .catch(e => {
//         console.log('ERROR >>>', e);
//     });

async function execute() {
    try {
        const phase1 = await esperaAi('Phase 1', rand());
        console.log(phase1);
        const phase2 = await esperaAi('Phase 2', rand());
        console.log(phase2);
        const phase3 = await esperaAi(222, rand());
        console.log(phase3);
    }
    catch (e) {
        console.log(e);
    }
}

execute();