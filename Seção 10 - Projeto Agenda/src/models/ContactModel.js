const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    phoneNumber: { type: String, required: false, default: '' },
    registeredAt: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contact = null;
    }

    static async searchID(id) {
        if (typeof id !== 'string') return;
        const contact = await ContactModel.findById(id);
        return contact;
    }

    async register() {
        this.validate();
        if (this.errors.length > 0) return;
        this.contact = await ContactModel.create(this.body);
    }

    validate() {
        this.cleanUp();
        // Validation
        // @mail
        if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        if (!this.body.name) this.errors.push('Nome é um campo obrigatório.');
        if (!this.body.email && !this.body.phoneNumber) this.errors.push('Email ou telefone são obrigatórios.');
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        this.body = {
            name: this.body.name,
            lastname: this.body.lastname,
            email: this.body.email,
            phoneNumber: this.body.phoneNumber,
        };
    }
}

module.exports = Contact;