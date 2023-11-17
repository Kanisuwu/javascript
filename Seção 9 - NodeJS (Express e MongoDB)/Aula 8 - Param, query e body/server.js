const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.send(`
    <form action="/" method="POST">
    Nome: <input type="text" name="name">
    <button>Enviar Formulário</button>
    </form>
    `);
});

app.get('/tests/:users?/:param?', (req, res) => {
    // Params = Partes das rotas da URL.
    console.log(req.params);
    // Query String = Vem de uma parte da URL que precisa ser separada por começo ? e contínuo em &.
    console.log(req.query);
    res.send(req.params.users);
});

app.post('/', (req, res) => {
    console.log(req.body)
    res.send(`Sent: ${req.body.name}`);
});

app.get('/contato', (req, res) => {
    res.send('Obrigado por entrar em contato conosco.');
});

app.listen(3000, () => {
    console.log('Acessar o http://localhost:3000');
    console.log('Servidor sendo executado na porta: 3000.')
});