// function makeCalc(){
//     return {
//         display: document.querySelector('.display'),
//         btnClear: document.querySelector('.btn-c'),


//         start(){
//             this.clickBtns();
//             this.keyPressing();
//         },

//         deleteOne(){
//             this.display.value = this.display.value.slice(0, -1);
//         },

//         clearDisplay(){
//             this.display.value = '';
//         },

//         doCalc(){
//             let calcu = this.display.value;
//             try {
//                 calcu = eval(calcu);
//                 if(!calcu){
//                     alert('Invalid Calculation');
//                     return;
//                 }
//                 this.display.value = calcu;
//             } catch(e) {
//                 alert('Invalid Calculation');
//                 return;
//             }
//         },

//         clickBtns(){
//             document.addEventListener('click', (e) => { // Arrow Functions mantem o antigo *this* (o objeto calculadora), diferente de function que se refere a *document*
//                 const el = e.target;

//                 if (el.classList.contains('btn-num')){
//                     this.btnParaDisplay(el.innerText);
//                 }
//                 if (el.classList.contains('btn-c')){
//                     this.clearDisplay();
//                 }
//                 if (el.classList.contains('btn-del')){
//                     this.deleteOne();
//                 }
//                 if (el.classList.contains('btn-eq')){
//                     this.doCalc();
//                 }
//             })
//         },

//         keyPressing(){
//             this.display.addEventListener('keyup', (e) => {
//                 if (e.keyCode === 13){
//                     this.doCalc();
//                 }
//             })
//         },

//         btnParaDisplay(value){
//             this.display.value += value;
//         }
//     };
// }

// const calc = makeCalc();

// calc.start();

function Calculadora(){
    const display = document.querySelector('.display');

    const btnForDisplay = (value) => {
        display.value += value;
        display.focus();
    };
    
    const clearDisplay = () => {display.value = '';};

    const deleteOne = () => {display.value = display.value.slice(0, -1);};

    const keyPressing = () => {display.addEventListener('keyup', (e) => {
        if (e.keyCode === 13){
            doCalc();
        }
    })};

    const clickBtns = () => {document.addEventListener('click', (e) => {
        const el = e.target;

        if (el.classList.contains('btn-num')){
            btnForDisplay(el.innerText);
        }
        if (el.classList.contains('btn-c')){
            clearDisplay();
        }
        if (el.classList.contains('btn-del')){
            deleteOne();
        }
        if (el.classList.contains('btn-eq')){
            doCalc();
        } 
    })};

    const doCalc = () => {
        try {
            const calcu = eval(display.value);
            if(!calcu){
                alert('Invalid Calculation');
                 return;
            }
            display.value = calcu;
        } catch(e) {
            alert('Invalid Calculation');
            return;
        }
    };

    this.start = () => {clickBtns(); keyPressing();}
}

const calc = new Calculadora();
calc.start();