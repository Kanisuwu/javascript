import Password from './modules/passwordGenerator.js';

import './assets/css/style.css';


const btn = document.querySelector('.btn');
const size = document.querySelector('#size');
const result = document.querySelector('.result');

const computePassword = (sizing) => {
    let isValid = true;
    const cfg = {
        numbers: document.querySelector('#numbers').checked,
        upperCase: document.querySelector('#UC').checked,
        lowerCase: document.querySelector('#LC').checked,
        symbols: document.querySelector('#symbols').checked,
    };

    let count = 0;
    for (const key in cfg) {
        if (!cfg[key]) {
            count++;
        }
        if (count === 4) {
            isValid = false;
        }
    }

    if (sizing <= 0) return `Tamanho Inválido`;
    if (!isValid) return `Escolha uma opção.`;

    const passwordObj = new Password(Number(sizing), cfg.numbers, cfg.upperCase, cfg.lowerCase, cfg.symbols);
    return passwordObj.generate();
};

btn.addEventListener('click', () => {
    const password = computePassword(size.value);
    result.innerText = password;
});
