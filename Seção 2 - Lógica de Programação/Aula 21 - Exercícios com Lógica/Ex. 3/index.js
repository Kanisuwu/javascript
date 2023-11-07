function fizz(e){
    let divisibleBy3 = (e % 3 === 0) ? 'Fizz' : false;
    let divisibleBy5 = (e % 5 === 0) ? 'Buzz' : false;
    if (!divisibleBy3 && !divisibleBy5) {
        return e;
    }
    if (divisibleBy3 && divisibleBy5) {
        return `${divisibleBy3}${divisibleBy5}`;
    }
    if (divisibleBy5) {
        return divisibleBy5
    }
    if (divisibleBy3) {
        return divisibleBy3
    }
}

const numero = fizz(30);

for (let i = 0; i <= 100; i++){
    let numero = fizz(i);
    console.log(i, numero);
}