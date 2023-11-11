const Pokedex = require('pokeapi-js-wrapper');
const P = new Pokedex.Pokedex();

class PokemonHTML {
    constructor(pokemon) {
        Object.defineProperties(this, {
            name: {
                enumerable: true,
                configurable: false,
                value: pokemon,
            },
        });
    }
    get pokemonCatalogue() {
        return (async () => {
            try {
                const species = await P.getPokemonByName(this.name);
                return [species.name, species.types, species.stats, species.forms, species.abilities];
            }
            catch (error) {
                console.log('ERR >>> ', error);
            }
        })();
    }
    get evolutionChain() {
        return (async () => {
            try {
                const pokemonsToEvolve = [];
                const species = await P.getPokemonSpeciesByName(this.name);
                const evolution = await P.resource(species.evolution_chain.url);
                const evolutionList = evolution.chain.evolves_to;
                for (const pokemon of evolutionList) {
                    pokemonsToEvolve.push(pokemon.species.name);
                }
                return pokemonsToEvolve;
            }
            catch (error) {
                console.log('ERR >>> ', error);
            }
        })();
    }
    get sprite() {
        return (async () => {
            try {
                // Make a request to the pokemon sprite from front.
            }
            catch (error) {
                console.log('ERR >>>', error);
            }
        })();
    }
}

const eevee = new PokemonHTML('eevee');

(async () => {
    try {
        // console.log(await eevee.pokemonCatalogue);
        const eevolutions = await eevee.evolutionChain;
        const pokemonFilterVaporeon = eevolutions.filter((pokemon) => pokemon === 'vaporeon').join('');
        const vaporeon = new PokemonHTML(pokemonFilterVaporeon);
        const infoV = await vaporeon.pokemonCatalogue;
        console.log(infoV);
    }
    catch (e) {
        console.log(e);
    }
})();