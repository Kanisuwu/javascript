class AuthFrom {
    constructor() {
        this.form = document.querySelector('.POST');
        this.events();
    }
    events() {
        this.form.addEventListener('submit', e => {
            this.handleSubmit(e);
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        const validFields = this.isFieldsValids();
        const validPass = this.isPasswordValid();

        if (validFields && validPass) {
            alert('Formulário Enviado.');
            this.form.submit();
        }
    }
    isPasswordValid() {
        let valid = true;

        const password = this.form.querySelector('.password');
        const passwordAgain = this.form.querySelector('.password-again');

        if (password.value !== passwordAgain.value) {
            valid = false;
            this.throwError(password, 'As senhas precisam ser iguais.');
            this.throwError(passwordAgain, 'As senhas precisam ser iguais.');
        }

        if (password.value.length < 6 || password.value.length > 12) {
            valid = false;
            this.throwError(password, 'A senha precisa ter entre 6 e 12 caractéres.');
        }

        return valid;
    }
    isFieldsValids() {
        let valid = true;
        for (const errorText of this.form.querySelectorAll('.error-text')) {
            errorText.remove();
        }
        for (const campo of this.form.querySelectorAll('.validate')) {
            const label = campo.previousElementSibling.innerText;
            if (!campo.value) {
                this.throwError(campo, `${label} precisa ser preenchido.`);
                valid = false;
            }
            if (campo.classList.contains('cpf')) {
                if (!this.validateCpf(campo)) valid = false;
            }
            if (campo.classList.contains('user')) {
                if (!this.validateUser(campo)) valid = false;
            }
        }
        return valid;
    }
    validateUser(campo) {
        const user = campo.value;
        let valid = true;
        if (user.length < 3 || user.length > 12) {
            this.throwError(campo, 'Usuário precisa ter o tamanho correto.');
            valid = false;
        }
        if (!user.match(/^[a-zA-Z0-9]+$/g)) {
            this.throwError(campo, 'Usuário precisa ter letras e/ou números.');
            valid = false;
        }
        return valid;
    }
    validateCpf(campo) {
        const cpf = new CPF(campo.value);
        if (!cpf.isValid) {
            this.throwError(campo, 'CPF inválido.');
            return false;
        }
        return true;
    }
    throwError(field, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        field.insertAdjacentElement('afterend', div);
    }
}

const authenticate = new AuthFrom();
