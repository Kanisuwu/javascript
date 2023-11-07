const elements = [
    {tag: 'p', content: 'Frase 1'},
    {tag: 'div', content: 'Frase 2'},
    {tag: 'footer', content: 'Frase 3'},
    {tag: 'section', content: 'Frase 4'}
];

function insertElements(target){
    for (let i = 0; i < elements.length; i++){
        let {tag, content} = elements[i];
        let tagCriada = document.createElement(tag);
        tagCriada.innerHTML = content;
        target.appendChild(tagCriada)
        console.log(tag, content);
    }
}

function main(){
    const section = document.querySelector('.container');
    const div = document.createElement('div');
    section.appendChild(div);
    insertElements(div);
}

main();