// import mongoose from "mongoose";
import Pokedex from "pokedex-promise-v2";

const P = new Pokedex();

// const PokemonSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     types: { type: Array, required: true },
//     sprite: { type: String, required: true },
//     stats: { type: Array, required: true, default: [] },
// });

// const PokeModel = mongoose.model('Pokemon', PokemonSchema);

export default class Pokemon {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.pokemon = null;
    }

    /*
     *
     * -------- METHODS --------
     *
     */

    // Try to contact the pokeAPI and check if was successful.
    async searchPokemon() {
        if (!this.body.name) return;
        try {
            const pokemonName = Pokemon.stringCleanUp(this.body.name);
            const pokemon = await P.getPokemonByName(pokemonName);
            if (!pokemon) {
                this.errors.push('Pokemon does not exist.');
                return;
            }
            return pokemon;
        }
        catch (e) {
            console.log(e);
        }
    }
    // Gather data about the pokemon.
    async gatherData() {
        try {
            if (this.errors.length > 0) return;
            const pokemon = await this.searchPokemon();
            if (!pokemon) return;

            const statsCleaned = [];
            const typesCleaned = [];
            const evolutionChain = await this.gatherEvolutions(pokemon.species.url);

            pokemon.stats.forEach((obj) => {
                statsCleaned.push({ base_stat: obj.base_stat, name: Pokemon.capitalize(obj.stat.name) });
            });

            pokemon.types.forEach((obj) => {
                typesCleaned.push(Pokemon.capitalize(obj.type.name));
            });

            const pokeData = {
                name: Pokemon.capitalize(pokemon.name),
                types: typesCleaned,
                sprite: pokemon.sprites.front_default,
                stats: statsCleaned,
                // evolutionChain.evolves_to | And it's an array.
                evolutionChain: evolutionChain,
            };
            console.log(pokeData.evolutionChain.evolves_to);
            return pokeData;
        }
        catch (e) {
            console.log('ERR >>> ' + e);
        }
    }

    // Get nested data. Communicates with gatherEvolutions()
    getEvolutionChain(chain) {
        const chainedEvolution = [];
        let i = 0;

        for (const obj of chain.evolves_to) {
            chainedEvolution.push({
                name: obj.species.name,
                url: obj.species.url,
                evolves_to: {
                    name: obj.evolves_to[i] ? obj.evolves_to[i].species.name : '',
                    url: obj.evolves_to[i] ? obj.evolves_to[i].species.url : '',
                },
            });
            i++;
        }

        return chainedEvolution;
    }

    // Gather general info of evolution
    async gatherEvolutions(speciesURL) {
        const species = await P.getResource(speciesURL);
        if (!species) return;

        const evolutionURL = await P.getResource(species.evolution_chain.url);
        // Access the evolutionary chain
        const evolutionChain = evolutionURL.chain;

        const chainObj = {
            evolves_to: this.getEvolutionChain(evolutionChain),
            from: evolutionChain.species.name,
            url: evolutionChain.species.url,
        };
        return chainObj;
    }
    /**
     *
     *
     * -------- STATICS --------
     *
     *
     */
    static stringCleanUp(name) {
        const lowerCaseName = name.toLowerCase();
        const cleanName = lowerCaseName.trim();
        return cleanName;
    }
    static capitalize(string) {
        const upperCaseLetter = string.charAt(0).toUpperCase();
        const cutWord = string.slice(1);
        string = upperCaseLetter + cutWord;
        return string;
    }
}