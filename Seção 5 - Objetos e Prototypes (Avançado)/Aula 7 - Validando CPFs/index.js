// 705.484.450-52 | 070.987.720-03
/*
 * 7x 0x 5x 4x 8x 4x 4x 5x 0x ---> Cálculo do penúltimo dígito
 * 10 9  8  7  6  5  4  3  2
 *
 * 7x 0x 5x 4x 8x 4x 4x 5x 0x 5x ---> Cálculo do último dígito
 * 11 10 9  8  7  6  5  4  3  2
 *
 */

// Make 'CPF' only a array of fake numbers
const cleanCPF = (cpf) => cpf.replace(/\D+/g, '');

// Multiply the entire array of numbers sequencially
const multiply = (arrayNum, lastDigit) => {
    const multiple = (lastDigit) ? 11 : 10;
    const arrayLocal = [...arrayNum];
    if (lastDigit) {
        arrayLocal.splice(-1, 1);
    }
    else {
        arrayLocal.splice(-2, 2);
    }
    const multiplied = arrayLocal.map((value, index) => {
        return value * (multiple - index);
    });
    return multiplied;
};
// Sum the total of an array.
const total = (sum) => {
    return sum.reduce((acc, value) => acc += value);
};

const digits = (num) => {
    let result = 11 - (num % 11);
    if (result > 9) {
        result = 0;
    }
    return result;
};

const checkValidation = (firstDigit, secondDigit, numCpf) => {
    const cpf = [...numCpf];
    const last = cpf.pop();
    const lasButOne = cpf.pop();
    if (firstDigit === lasButOne && secondDigit === last) {
        return true;
    }
    else {
        return false;
    }
};
// return the normal 'CPF'
function CPF(cpf) {
    Object.defineProperties(this, {
        line: {
            enumerable: true,
            configurable: false,
            get: function() {
                return cpf;
            },
            set: function(value) {
                if (cpf !== 'string') return;
                cpf = value;
            } },
        // return the digits to prove if the 'CPF' is valid or not
        isValid: {
            configurable: false,
            enumerable: false,
            get: function() {
                const array = Array.from(cleanCPF(cpf)).map(Number);
                const first = digits(total(multiply(array, false)));
                const second = digits(total(multiply(array, true)));
                if (checkValidation(first, second, array)) {
                    return 'CPF válido.';
                }
                else {
                    return 'CPF Inválido!';
                }
            },
        },
    });
}

const cpf = new CPF('705.484.450-52');

console.log(cpf.isValid);