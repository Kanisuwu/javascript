export default class Password {
    constructor(size, numbers = false, upperCase = false, lowerCase = false, symbols = false) {
        this.size = size;
        this.numbers = numbers;
        this.upperCase = upperCase;
        this.lowerCase = lowerCase;
        this.symbols = symbols;
    }
    generate() {
        if (this.size <= 0) return;
        const make = this.randomizePassword(this.size);
        return make;
    }
    randomizePassword(max) {
        let password = '';
        let passwordLength = password.length;
        for (let i = 0; i <= max; i++) {
            // Could use a math.random() and charCodes. <<<<<
            if (this.upperCase && passwordLength < max) {
                password = this.makePassword(password, 'upperCase');
                passwordLength++;
            }
            if (this.lowerCase && passwordLength < max) {
                password = this.makePassword(password, 'lowerCase');
                passwordLength++;
            }
            if (this.numbers && passwordLength < max) {
                password = this.makePassword(password, 'numbers');
                passwordLength++;
            }
            if (this.symbols && passwordLength < max) {
                password = this.makePassword(password, 'symbols');
                passwordLength++;
            }
        }
        return password;
    }
    makePassword(target, type) {
        const characters = {
            upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowerCase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: `!"#$%&'()*+,-./`,
        };
        if (type) {
            return target += characters[type].charAt(Math.floor(Math.random() * (characters[type].length - 1) + 1));
        }
    }
}