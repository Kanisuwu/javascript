const express = require('express');
const app = express();

/*
 * 
 *          Criar   Ler   Atual.  Deletar
 * CRUD --> CREATE, READ, UPDATE, DELETE
 *          POST    GET   PUT     DELETE
 *  
 * http://meusite.com/ <-- GET --> Entregue a página /
 * http://meusite.com/sobre <-- GET --> Entregue a página /sobre
 * http://meusite.com/contato <-- GET --> Entregue a página /contato
 * 
 */

app.get('/', (request, response) => {
    response.send(`
    <form action="/" method="POST">
    Nome: <input type="text" name="nome">
    <button>Enviar</button>
    </form>
    `);
});

app.post('/', (req, res) => {
    res.send('Recebi o formulário');
});

app.get('/contato', (req, res) => {
    res.send('Obrigado por entrar em contato conosco.');
});

app.listen(3000, () => {
    console.log('Acessar o http://localhost:3000');
    console.log('Servidor sendo executado na porta: 3000.')
});