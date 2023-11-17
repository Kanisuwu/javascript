const express = require('express');
const app = express();



app.get('/', (request, response) => {
    response.send(`
    <form action="/" method="POST">
    Nome: <input type="text" name="nome">
    <button>Enviar Formulário</button>
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