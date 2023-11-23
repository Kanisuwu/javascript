const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

// Usually we work with classes.
class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.validate();
        if (this.errors.length > 0) return;
        await this.userExist();
        if (this.errors.length > 0) return;

        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
    }

    async log() {
        this.validate();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push('Credenciais inválidas.');
            return;
        }
        if (!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Credenciais Inválidas.');
            this.user = null;
            return;
        }
    }

    async userExist() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usuário já existe.');
    }

    validate() {
        this.cleanUp();
        // Validation
        // @mail
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        // Password between 3 and 50 in size
        if (this.body.password.length < 3 || this.body.length > 50) this.errors.push('Senha inválida');
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password,
        };
    }
}

module.exports = Login;