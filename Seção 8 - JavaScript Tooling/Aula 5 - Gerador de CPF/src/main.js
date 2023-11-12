import newCPF from './modules/newCPF.js';
import './assets/css/style.css';

(function() {
    const Cpf = new newCPF();
    const makeCpf = Cpf.makeNewCpf();
    const cpfFomat = Cpf.format(makeCpf);
    const htmlCpfResult = document.querySelector('.result');
    htmlCpfResult.innerText = cpfFomat;
})();
