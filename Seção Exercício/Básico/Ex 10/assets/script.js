const btnMultiply = document.querySelector('#multiply');
const btnDivide = document.querySelector('#divide');
const inputOne = document.querySelector('#first-number');
const inputTwo = document.querySelector('#second-number');
const result = document.querySelector('.result');


document.addEventListener('click', function(event){
    const num1 = Number(inputOne.value);
    const num2 = Number(inputTwo.value);
    if (event.target === btnMultiply){
        const multi = num1 * num2;
        result.innerHTML = multi;
        console.log(num1);
    }
    if (event.target === btnDivide){
        const divi = num1 / num2;
        result.innerHTML = divi;
    }
})