function makeCalc(){
    return {
        display: document.querySelector('.display'),
        btnClear: document.querySelector('.btn-c'),


        start(){
            this.clickBtns();
            this.keyPressing();
        },

        deleteOne(){
            this.display.value = this.display.value.slice(0, -1);
        },

        clearDisplay(){
            this.display.value = '';
        },

        doCalc(){
            let calcu = this.display.value;
            try {
                calcu = eval(calcu);
                if(!calcu){
                    alert('Invalid Calculation');
                    return;
                }
                this.display.value = calcu;
            } catch(e) {
                alert('Invalid Calculation');
                return;
            }
        },

        clickBtns(){
            document.addEventListener('click', (e) => { // Arrow Functions mantem o antigo *this* (o objeto calculadora), diferente de function que se refere a *document*
                const el = e.target;

                if (el.classList.contains('btn-num')){
                    this.btnParaDisplay(el.innerText);
                }
                if (el.classList.contains('btn-c')){
                    this.clearDisplay();
                }
                if (el.classList.contains('btn-del')){
                    this.deleteOne();
                }
                if (el.classList.contains('btn-eq')){
                    this.doCalc();
                }
            })
        },

        keyPressing(){
            this.display.addEventListener('keyup', (e) => {
                if (e.keyCode === 13){
                    this.doCalc();
                }
            })
        },

        btnParaDisplay(value){
            this.display.value += value;
        }
    };
}

const calc = makeCalc();

calc.start();