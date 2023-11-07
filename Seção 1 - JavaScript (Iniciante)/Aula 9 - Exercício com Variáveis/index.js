// let varD; // D -> A
let varA = 'A'; // A -> B
let varB = 'B'; // B -> C
let varC = 'C'; // C -> D
                

// A -> C (varC)
// B -> C (varB)
// C -> A (varA)

console.log(varA, varB, varC);
// Maneira antiga (Eu que resolvi)
// varD = varA;
// varA = varB;
// varB = varC;
// varC = varD;
//Maneira Moderna
[varA, varB, varC] = [varB, varC, varA];

console.log(varA, varB, varC);