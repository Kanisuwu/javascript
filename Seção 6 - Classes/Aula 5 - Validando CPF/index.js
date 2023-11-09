class CPF {
    constructor(strCpf) {
        Object.defineProperties(this, {
            cleanCPF: {
                writable: false,
                enumerable: true,
                value: strCpf.replace(/\D+/g, ''),
            },
        });
    }
    isSequence() {
        const sequential = this.cleanCPF[0].repeat(this.cleanCPF.length);
        return sequential === this.cleanCPF;
    }
    makeNewCPF() {
        const cpfSliced = this.cleanCPF.slice(0, -2);
        const digit1 = CPF.makeDigit(cpfSliced);
        const digit2 = CPF.makeDigit(cpfSliced + digit1);
        return cpfSliced + digit1 + digit2;
    }
    get isValid() {
        if (!this.cleanCPF) return false;
        if (this.cleanCPF.length !== 11) return false;
        if (this.isSequence()) return false;
        const completeCpf = this.makeNewCPF();
        return completeCpf === this.cleanCPF;
    }
    static makeDigit(cleanCPF) {
        const arrayCPF = Array.from(cleanCPF);
        const multiple = arrayCPF.length + 1;
        const arrayMultiplied = arrayCPF.map((value, index) => {
            return value * (multiple - index);
        });
        const sum = arrayMultiplied.reduce((acc, value) => acc += value);
        const total = 11 - (sum % 11);
        return total > 9 ? '0' : total + '';
    }
}