function* generator1(){ // Lazy Evaluation
    /*BLOCK*/
    yield 'Value 1';
    /*BLOCK*/
    yield 'Value 2';
    /*BLOCK*/
    yield 'Value 3';
}

function* generator2(){
    let i = 0;
    while (true) {
        yield i;
        i++
    }
}

function* generator3(){
    yield 1;
    yield 2;
    yield 3;
}

function* generator4(){
    yield* generator3();
    yield 4;
    // return pararia a função antes mesmo de chegar no yield 5.
    yield 5;
}

// const g1 = generator1();
// const g2 = generator2();

// for (let value of g1){
//     console.log(value);
// }

// console.log(g2.next().value);
// console.log(g2.next().value);

const g4 = generator4();

for (let value of g4){
    console.log(value);
}