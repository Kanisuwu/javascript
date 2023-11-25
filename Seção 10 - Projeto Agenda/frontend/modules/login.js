import validator from "validator";

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.cleanErrors();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        let error = false;

        if (!validator.isEmail(emailInput.value)) {
            this.appendMessage('.email', 'Email is not valid');
            error = true;
        }
        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            this.appendMessage('.password', 'Password must be between 3 and 50 in size.');
            error = true;
        }

        if (!error) el.submit();
    }
    appendMessage(el, message) {
        const target = this.form.querySelector(el);
        console.log(this.form);
        const errMsg = `<p class="errMsg" style="color: red; font-size: 12px;">*${message}</p>`;
        target.innerHTML += errMsg;
    }

    cleanErrors() {
        for (const child of this.form.children) {
            const target = child.querySelector('.errMsg');
            if (target) {
                target.remove();
            }
        }
    }
}