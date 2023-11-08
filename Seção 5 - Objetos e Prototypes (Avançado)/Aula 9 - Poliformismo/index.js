// Superclass

function Account(agency, account, currency) {
    this.agency = agency;
    this.account = account;
    this.currency = currency;
}

Account.prototype.getMoney = function(value) {
    if (this.currency < value) {
        this.seeCurrency();
        console.log('Not enough money.');
        return;
    }
    this.currency -= value;
    this.seeCurrency();
};
Account.prototype.sendMoney = function(value) {
    this.currency += value;
    this.seeCurrency();
};
Account.prototype.seeCurrency = function() {
    console.log(`Ag/c: ${this.agency} | ${this.account}`);
    console.log(`Currency: ${this.currency.toFixed(2)}`);
};

// Make a new type of account
function Current(agency, account, currency, limit) {
    Account.call(this, agency, account, currency);
    this.limit = limit;
}

Current.prototype = Object.create(Account.prototype);
Current.prototype.constructor = Current;

Current.prototype.getMoney = function(value) {
    if ((this.currency + this.limit) < (value)) {
        this.seeCurrency();
        console.log('Not enough money.');
        return;
    }
    this.currency -= value;
    this.seeCurrency();
};

const current = new Current(1, 1, 100, 100);
current.getMoney(200);
console.log(current);

function Savings(agency, account, currency) {
    Account.call(this, agency, account, currency);
}

Savings.prototype = Object.create(Account.prototype);
Savings.prototype.constructor = Savings;

const save = new Savings(1, 1, 30);
save.getMoney(30);
console.log(save);