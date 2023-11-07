const obj1 = {strength: 1, dexterity: 1, constitution: 2};
const obj2 = {strength: 3, dexterity: 1, constitution: 2, intelligence: 2};
let result = true;

for (i in obj1){
    if (obj1[i] !== obj2[i]){
        result = false;
    }
}

console.log(result);