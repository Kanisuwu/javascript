// IIFE - Immediately Invoked Function Expression
// Envolva a IIFE em parênteses para a funcionalidade
(function(idade, peso, altura){ // Não toca o escopo global
    /* 
     * PROTEGIDO DO ESCOPO GLOBAL 
     */
    const name = 'Slugcat';
    function hi(){ // As regras para essas funções dentro do closure seguem a mesma
        console.log(`Hi ${name}`)
    }
    hi();
    console.log(idade, peso, altura)
})(20, 95, 1.89);

// Não tem acesso ao escopo léxico da função IIFE.
const name = 'Kanisu';

console.log(name);