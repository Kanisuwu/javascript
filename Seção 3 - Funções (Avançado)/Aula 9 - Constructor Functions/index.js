// Função Construtora -> Constróo Objetos
// Função Fábrica -> Fabrica Objetos

// Fábrica -> criaPessoa();
// Construtora -> new Pessoa();

function Pessoa(name, lastname){
    const id = 12345;
    const method = () => { 
        /*BLOCK*/
    }

    // A variável acima e a função NÃO estarão disponíveis para os objetos criados.

    this.name = name;
    this.lastname = lastname;
    // Não precisa de return
    this.method = () => {
        console.log(`${this.name}: Oi!`)
    }

    // quando usamos *this* são considerados métodos e atributos PÚBLICOS.
}

const p1 = new Pessoa('Kanisu', 'Mitsuki');

console.log(p1.name);
p1.method();