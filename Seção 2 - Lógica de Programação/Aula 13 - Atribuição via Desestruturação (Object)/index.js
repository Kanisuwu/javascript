const person = {
    name: 'Slugcat',
    technique: 'Digital',
    powLevel: 7,
    skills: {
        innate: {
            first: 'Digital Possesion',
            second: 'Biological Possesion'
        },
        thirdParty: {
            first: 'Healing',
            second: 'Buff'
        }
    }
}
// const name = person.name;

const { name, technique, powLevel: power = 0, ...rest } = person;

console.log(name, technique, power, rest);