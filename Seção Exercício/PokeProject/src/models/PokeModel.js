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
        this.info = null;
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
            console.error('Error while searching for pokemon:', e);
            return false;
        }
    }
    // Gather data about the pokemon.
    async gatherData() {
        try {
            if (this.errors.length > 0) return;
            const pokemon = await this.searchPokemon();
            if (!pokemon) throw new ReferenceError('<pokemon> has undefined value.');

            const stats = this.getStats(pokemon);
            const types = this.getTypes(pokemon);
            const evolutionChain = await this.gatherEvolutions(pokemon.species.url);

            /**
             * Represents the data for a Pokemon.
             * @typedef {Object} PokeData
             * @property {string} name - The capitalized name of the Pokemon.
             * @property {string[]} types - The types of the Pokemon.
             * @property {string} sprite - The URL of the Pokemon's sprite image.
             * @property {Object[]} stats - The stats of the Pokemon.
             * @property {Object[]} chainData - The evolution chain of the Pokemon.
             */
            const pokeData = {
                name: Pokemon.capitalize(pokemon.name),
                types: types,
                sprite: pokemon.sprites.front_default,
                stats: stats,
                chainData: this.evolutionData(evolutionChain),
            };
            this.info = pokeData;
        }
        catch (e) {
            console.error('Could not gather data: ', e);
            this.errors.push('Pokemon cannot be gathered.');
        }
    }

    getTypes(pokemon) {
        const types = [];
        pokemon.types.forEach((obj) => {
            types.push(Pokemon.capitalize(obj.type.name));
        });
        return types;
    }

    getStats(pokemon) {
        const stats = [];
        pokemon.stats.forEach((obj) => {
            stats.push({ base_stat: obj.base_stat, name: Pokemon.capitalize(obj.stat.name) });
        });
        return stats;
    }

    // Get nested data. Communicates with gatherEvolutions()
    getEvolutionChain(chain) {
        const chainedEvolution = [];
        let i = 0;

        /**
         * @typedef {Object[]} chainedEvolution
         * @property {string} name
         * @property {string} url
         * @property {Object} evolves_to
         */
        for (const obj of chain.evolves_to) {
            chainedEvolution.push({
                name: obj.species.name,
                /**
                 * @memberof chainedEvolution
                 * @type {Object}
                 * @property {string} name
                 */
                evolves_to: {
                    name: obj.evolves_to[i] ? obj.evolves_to[i].species.name : '',
                },
            });
            i++;
        }

        return chainedEvolution;
    }

    // Gather general info of evolution
    async gatherEvolutions(speciesURL) {
        const species = await P.getResource(speciesURL);
        const evolutionURL = await P.getResource(species.evolution_chain.url);
        if (!species || !evolutionURL) throw new ReferenceError('<species> or <evolutionURL> has undefined value.');

        // Access the evolutionary chain
        const evolutionChain = evolutionURL.chain;

        /**
         * chainObj structure:
         * @typedef {Object} chainObj
         * @property {Object[]} evolves_to
         * @property {string} from
         */
        const chainObj = {
            evolves_to: this.getEvolutionChain(evolutionChain),
        };
        return chainObj;
    }

    async evolutionData(evolChainObj) {
        try {
            const chainData = [{
                from: evolChainObj.from,
            }];
            for (const key in evolChainObj.evolves_to) {
                const pokemonName = new Pokemon({ name: evolChainObj.evolves_to[key].name });
                const pokemon = await pokemonName.searchPokemon();
                if (!pokemon) throw new Error('<pokemon> has undefined value.');
                chainData.push({
                    name: Pokemon.capitalize(pokemon.name),
                    data: pokemon.sprites.front_default,
                });
            }
            return chainData;
        }
        catch (e) {
            console.error('Cannot gather evolution data: ', e);
            return;
        }
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