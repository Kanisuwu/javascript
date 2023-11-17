exports.initial = (req, res) => {
    res.send(`
    <form action="/" method="POST">
    Nome: <input type="text" name="name">
    <button>Enviar Formulário</button>
    </form>
    `);
}; 

exports.handle = (req, res) => {
    res.send(`New ${req.body.name}`);
};