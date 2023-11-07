// Factory Function
function makePerson(name, lastname, peso, altura){
    return {
        name,
        lastname,
        //Getter
        get completeName(){
            return `${name} ${lastname}`
        },

        //Setter
        set completeName(value){
            value = value.split();
            name = value.shift();
            lastname = value.join(' ');
        },

        talk(subject){
            return `${name} is talking about ${subject}. Tem ${this.peso} kg.`
        },

        peso,
        altura, // Precisa de THIS para acessar na função ^

        // Getter, obtains the value
        get imc(){
            const index = this.peso / (this.altura ** 2);
            return index.toFixed(2);
        }
    }
}

const p1 = makePerson('Slug', 'Cat', 50, 1.55);

console.log(p1.talk('math'));
console.log(p1.imc);
p1.completeName = 'Slugcat Catish Kitty';
console.log(p1.completeName);
