const section = document.querySelector('.container');
const ps = section.querySelectorAll('p');
const style = getComputedStyle(document.body);
const backgroundColor = style.backgroundColor;

console.log(backgroundColor);

for (let p of ps){
    console.log(p);
    p.style.backgroundColor = backgroundColor;
    p.style.color = 'white';
}