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
     * -------- ASYNC METHODS --------
     *
     */

    // Try to contact the pokeAPI and check if was successful.
    async searchPokemonSpecies() {
        if (!this.body.name) return;
        try {
            const pokemonName = Pokemon.stringCleanUp(this.body.name);
            const pokemon = await P.getPokemonByName(pokemonName);
            if (!pokemon) {
                this.errors.push('Pokemon does not exist.');
                return;
            }
            return pokemon.species.url;
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
            const url = await this.searchPokemonSpecies();
            const speciesData = await this.getSpeciesUrl(url);
            const pokemon = await P.getResource(speciesData.pokemon_url);
            const evolutionChain = await this.gatherEvolutions(speciesData);

            const stats = this.getStats(pokemon);
            const types = this.getTypes(pokemon);

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
                chainData: evolutionChain,
            };
            this.info = pokeData;
            console.log(pokeData);
        }
        catch (e) {
            console.error('Could not gather data: ', e);
            this.errors.push('Pokemon cannot be gathered.');
        }
    }

    async getSpeciesUrl(url) {
        try {
            let defaultPokemon;
            const species = await P.getResource(url);

            // Validates species
            if (!species) throw new ReferenceError('<species-data> is falsy.');

            // Validates the default pokemon
            for (const index in species.varieties) {
                if (species.varieties[index].is_default) {
                    defaultPokemon = species.varieties[index].pokemon.url;
                }
            }

            const speciesData = {
                evolution_chain_url: species.evolution_chain.url,
                evolves_from: species.evolves_from_species,
                pokemon_url: defaultPokemon || species.varieties[0].pokemon.url,
                from_url: url,
            };

            return speciesData;
        }
        catch (e) {
            console.error('Could not get species data: ', e);
            this.errors.push('Species Data not Found.');
        }
    }

    // Get nested data. Communicates with gatherEvolutions()
    async getEvolutionChain(url) {
        const chainedEvolution = [];
        const deeperData = [];
        const chainUrl = await P.getResource(url);
        const chainData = chainUrl.chain;

        for (const obj in chainData.evolves_to.evolves_to) {
            deeperData.push({
                name: obj.species.name,
                speciesUrl: obj.species.url,
                sprite: await this.getSpriteFromSpecies(obj.species.url),
            });
        }

        for (const obj of chainData.evolves_to) {
            /**
             * @typedef {Object[]} chainedEvolution
             * @property {string} name
             * @property {string} url
             * @property {Object} evolves_to
             */
            chainedEvolution.push({
                name: obj.species.name,
                speciesUrl: obj.species.url,
                sprite: await this.getSpriteFromSpecies(obj.species.url),
                evolves_to: deeperData,
            });
        }

        console.log(chainedEvolution);

        return chainedEvolution;
    }

    // Gather general info of evolution
    async gatherEvolutions(speciesDataObj) {
        try {
            const evolutionChain = speciesDataObj.evolution_chain_url;
            if (!evolutionChain) throw new ReferenceError('<evolutionChain> has undefined value.');

            let fromObj;

            if (speciesDataObj.evolves_from) {
                const fromName = speciesDataObj.evolves_from.name;
                const fromUrl = speciesDataObj.evolves_from.url;
                fromObj = {
                    name: fromName,
                    url: fromUrl,
                    sprite: await this.getSpriteFromSpecies(speciesDataObj.from_url),
                };
            }

            /**
             * chainObj structure:
             * @typedef {Object} chainObj
             * @property {Object[]} evolves_to
             * @property {string} from
             * @property {string} url
             */

            const chainObj = {
                evolves_to: await this.getEvolutionChain(evolutionChain),
                from: fromObj,
            };
            return chainObj;
        }
        catch (e) {
            console.error('Error in gathering evolutions: ', e);
            return;
        }
    }

    async getSpriteFromSpecies(url) {
        const speciesData = await this.getSpeciesUrl(url);
        const pokemon = await P.getResource(speciesData.pokemon_url);

        return pokemon.sprites.front_default;
    }

    /*
     *
     * -------- METHODS --------
     *
     */

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