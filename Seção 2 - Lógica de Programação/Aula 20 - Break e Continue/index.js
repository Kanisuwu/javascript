const array = [1, 2, 3, 4, 5, 6, 7 , 8, 9, 10];

for (let num of array) {
    if (num === 2) {
        console.log('Jumped 2!')
        continue; // Pula pra próxima iteração
    }
    console.log(num)
    if (num === 7) {
        console.log('Broke Here! [7]')
        break; // Para o laço a partir do 8.
    }
}