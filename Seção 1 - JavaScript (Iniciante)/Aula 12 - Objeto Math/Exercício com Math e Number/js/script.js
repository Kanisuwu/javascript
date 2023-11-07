const num = Number(prompt('Digite um número.'));
const numeroTitulo = document.getElementById('numero-titulo');
const texto = document.getElementById('texto');


numeroTitulo.innerHTML = num;
texto.innerHTML += `<p>Raíz Quadrada: ${num ** 0.5}`;
texto.innerHTML += `<p>${num} é um inteiro? ${Number.isInteger(num)}</p>`;
texto.innerHTML += `<p>É NaN? (Not a Number) ${Number.isNaN(num)}</p>`;
texto.innerHTML += `<p>Arredondado para baixo: ${Math.floor(num)}</p>`;
texto.innerHTML += `<p>Arredondado para cima: ${Math.ceil(num)}</p>`;
texto.innerHTML += `<p>Com duas casas decimais: ${num.toFixed(2)}</p>`;