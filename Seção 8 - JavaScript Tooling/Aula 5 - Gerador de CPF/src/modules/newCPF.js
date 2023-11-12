import CPF from './CPF.js';

export default class newCPF {
    rand(min = 100000000, max = 999999999) {
        return String(Math.floor(Math.random() * (max - min) + min));
    }
    makeNewCpf() {
        const cpfWithoutDigit = this.rand();
        const firstDigit = CPF.makeDigit(cpfWithoutDigit);
        const secondDigit = CPF.makeDigit(cpfWithoutDigit + firstDigit);
        const nCPF = cpfWithoutDigit + firstDigit + secondDigit;
        return nCPF;
    }
    format(cpf) {
        return (
            cpf.slice(0, 3) + '.' +
            cpf.slice(3, 6) + '.' +
            cpf.slice(6, 9) + '-' +
            cpf.slice(9, 11)
        );
    }
}

