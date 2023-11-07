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
// const cleanCPF = (cpf) => cpf.replace(/\D+/g, '');

// // Multiply the entire array of numbers sequencially
// const multiply = (arrayNum, lastDigit) => {
//     const multiple = (lastDigit) ? 11 : 10;
//     const arrayLocal = [...arrayNum];
//     if (lastDigit) {
//         arrayLocal.splice(-1, 1);
//     }
//     else {
//         arrayLocal.splice(-2, 2);
//     }
//     const multiplied = arrayLocal.map((value, index) => {
//         return value * (multiple - index);
//     });
//     return multiplied;
// };
// // Sum the total of an array.
// const total = (sum) => {
//     return sum.reduce((acc, value) => acc += value);
// };

// const digits = (num) => {
//     const result = 11 - (num % 11);
//     return (result > 9) ? 0 : result;
// };

// const checkValidation = (firstDigit, secondDigit, numCpf) => {
//     const cpf = [...numCpf];
//     const last = cpf.pop();
//     const lasButOne = cpf.pop();
//     if (firstDigit === lasButOne && secondDigit === last) {
//         return true;
//     }
//     else {
//         return false;
//     }
// };
// // return the normal 'CPF'
// function CPF(cpf) {
//     Object.defineProperties(this, {
//         line: {
//             enumerable: true,
//             configurable: false,
//             get: function() {
//                 return cpf;
//             },
//             set: function(value) {
//                 if (cpf !== 'string') return;
//                 cpf = value;
//             } },
//         // return the digits to prove if the 'CPF' is valid or not
//         isValid: {
//             configurable: false,
//             enumerable: false,
//             get: function() {
//                 const array = Array.from(cleanCPF(cpf)).map(Number);
//                 const first = digits(total(multiply(array, false)));
//                 const second = digits(total(multiply(array, true)));
//                 if (checkValidation(first, second, array)) {
//                     return 'CPF válido.';
//                 }
//                 else {
//                     return 'CPF Inválido!';
//                 }
//             },
//         },
//     });
// }

// const cpf = new CPF('705.484.450-52');

// console.log(cpf.line);
// console.log(cpf.isValid);

function CPF(cpfSent) {
    Object.defineProperty(this, 'cleanCpf', {
        enumerable: true,
        get: function() {
            return cpfSent.replace(/\D+/g, '');
        },
    });
}

CPF.prototype.valid = function() {
    if (this.cleanCpf === 'undefined') return false;
    if (this.cleanCpf.length !== 11) return false;
    if (this.isSequence()) return false;
    const cpfSliced = this.cleanCpf.slice(0, -2);
    const digit1 = this.makeDigit(cpfSliced);
    const digit2 = this.makeDigit(cpfSliced + digit1);
    const completeCpf = cpfSliced + digit1 + digit2;
    return completeCpf === this.cleanCpf;
};

CPF.prototype.makeDigit = function(cleanCpf) {
    const arrayCpf = Array.from(cleanCpf);
    const multiple = arrayCpf.length + 1;
    const arrayMultiplied = arrayCpf.map((value, index) => {
        return value * (multiple - index);
    });
    const sum = arrayMultiplied.reduce((acc, value) => acc += value);
    const total = 11 - (sum % 11);
    return total > 9 ? '0' : String(total);
};

CPF.prototype.isSequence = function() {
    const sequential = this.cleanCpf[0].repeat(this.cleanCpf.length);
    return sequential === this.cleanCpf;
};

const cpf = new CPF('070.987.720-03');

console.log(cpf.valid());