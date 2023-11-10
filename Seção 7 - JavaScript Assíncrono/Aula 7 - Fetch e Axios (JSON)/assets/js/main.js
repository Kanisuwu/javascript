// fetch('pessoas.json')
//     .then(response => response.json())
//     .then(json => loadElements(json));

axios('pessoas.json')
    .then(response => loadElements(response.data));

const loadElements = (json) => {
    const table = document.createElement('table');

    for (const person of json) {
        const tr = document.createElement('tr');

        let td = document.createElement('td');
        td.innerText = person.nome;
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerText = person.idade;
        tr.appendChild(td);

        table.appendChild(tr);
    }
    const result = document.querySelector('.result');
    result.appendChild(table);
};