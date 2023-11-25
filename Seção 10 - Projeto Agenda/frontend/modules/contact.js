import validator from "validator";

export default class Contact {
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
        const email = el.querySelector('input[name="email"]');
        const name = el.querySelector('input[name="name"]');
        const phoneNumber = el.querySelector('input[name="phoneNumber"]');

        let error = false;

        if (validator.isEmpty(email.value) && validator.isEmpty(phoneNumber.value)) {
            this.appendMessage('#email', 'Email or Phone number must be filled.');
            this.appendMessage('#phoneNumber', 'Email or Phone number must be filled.');
            error = true;
        }
        if (!validator.isEmpty(email.value) && !validator.isEmail(email.value)) {
            this.appendMessage('#email', 'Email is not valid.');
            error = true;
        }
        if (validator.isEmpty(name.value)) {
            this.appendMessage('#name', 'name must not be empty');
            error = true;
        }
        if (!error) {
            this.form.submit();
        }
    }
    appendMessage(el, message) {
        const target = this.form.querySelector(el);
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