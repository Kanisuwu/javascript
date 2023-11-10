import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

class PokemonHTML {
    constructor(pokemon) {
        Object.defineProperties(this, {
            name: {
                enumerable: true,
                configurable: false,
                value: pokemon,
            }
        })
    }
    get pokemonCatalogue() {
        return (async () => {
        try {
            const species = await P.getPokemonByName(this.name);
            return [species.name, species.types, species.stats, species.forms, species.abilities];
        } catch (error) {
            throw error
        }})();
    }
    get evolutionChain() {
        return (async () => {
            try {
                const pokemonsToEvolve = [];
                const species = await P.getPokemonSpeciesByName(this.name);
                const evolution = await P.getResource(species.evolution_chain.url);
                const evolutionList = evolution.chain.evolves_to
                for (let pokemon of evolutionList) {
                    pokemonsToEvolve.push(pokemon.species.name);
                }
                return pokemonsToEvolve;
            }
            catch (error) {
                throw error
            }
        })();
    }
}

const eevee = new PokemonHTML('eevee');

(async () => {
    try {
        // console.log(await eevee.pokemonCatalogue);
        const eevolutions = await eevee.evolutionChain;
        const pokemonFilterVaporeon = eevolutions.filter((pokemon) => pokemon === 'vaporeon').join('')
        const vaporeon = new PokemonHTML(pokemonFilterVaporeon);
        const infoV = await vaporeon.pokemonCatalogue;
        console.log(infoV);
    }
    catch (e) {
        console.log(e);
    }
})();



