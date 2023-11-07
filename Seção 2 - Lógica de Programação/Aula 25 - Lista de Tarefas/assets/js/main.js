const textInput = document.querySelector('.text-input');
const button = document.querySelector('.btn-add-task');
const ul = document.querySelector('.tasks');

function makeList(){
    const li = document.createElement('li');
    return li;
}

function makeTask(textInput){
    const li = makeList();
    li.innerText = textInput;
    ul.appendChild(li);
    makeButtonClear(li);
    saveTasks();
}

function clearInput(){
    textInput.value = '';
    textInput.focus();
}

function makeButtonClear(li){
    li.innerText += ' ';
    const buttonClear = document.createElement('button');
    buttonClear.innerText = 'Clear';
    buttonClear.setAttribute('class', 'clear');
    li.appendChild(buttonClear);
}

function saveTasks(){ // Salvando em JSON String
    const liTasks = ul.querySelectorAll('li');
    const taskArray = [];
    for (let task of liTasks){
        let taskText = task.innerText;
        taskText = taskText.replace('Clear', '').trim();
        taskArray.push(taskText);
    }
    const taskJson = JSON.stringify(taskArray); // Converte um elemento em JavaScript para String
    localStorage.setItem('tasks', taskJson);
    console.log(taskJson);
}

function readSave(){
    const tasks = localStorage.getItem('tasks'); // Converter uma string para um elemento JavaScript
    const taskArray = JSON.parse(tasks);
    for (let task of taskArray){
        makeTask(task);
    }
}

textInput.addEventListener('keypress', function(e){ // Fazendo tarefas com o ENTER
    if (e.keyCode === 13){
        if (!textInput.value) return;
        makeTask(textInput.value);
        clearInput();
    }
});


button.addEventListener('click', function(){ // Fazendo Tarefas com o botão
    if (!textInput.value) return;
    makeTask(textInput.value);
    clearInput();
});

document.addEventListener('click', function(e){ // Apagando Tarefas
    const el = e.target;
    if (el.classList.contains('clear')){
        el.parentElement.remove();
        saveTasks();
    }
});

readSave();