import mongoose from "mongoose";
import Pokedex from "pokedex-promise-v2";

const P = new Pokedex();

const PokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    types: { type: Array, required: true },
    sprite: { type: String, required: true },
    stats: { type: Array, required: false, default: [] },
});

const PokeModel = mongoose.model('Pokemon', PokemonSchema);

export default class Pokemon {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.pokemon = null;
    }

    // Try to contact the pokeAPI and check if was successful.
    async searchPokemon() {
        if (!this.body.name) return;
        try {
            const pokemonName = Pokemon.searchCleanUp(this.body.name);
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

            pokemon.stats.forEach((obj) => {
                statsCleaned.push({ base_stat: obj.base_stat, name: Pokemon.beautyString(obj.stat.name) });
            });

            pokemon.types.forEach((obj) => {
                typesCleaned.push(Pokemon.beautyString(obj.type.name));
            });

            const pokeData = {
                name: Pokemon.beautyString(pokemon.name),
                types: typesCleaned,
                sprite: pokemon.sprites.front_default,
                stats: statsCleaned,
            };
            return pokeData;
        }
        catch (e) {
            console.log('ERR >>> ' + e);
        }
    }
    static searchCleanUp(name) {
        const lowerCaseName = name.toLowerCase();
        const cleanName = lowerCaseName.trim();
        return cleanName;
    }
    static beautyString(string) {
        const upperCaseLetter = string.charAt(0).toUpperCase();
        const cutWord = string.slice(1);
        string = upperCaseLetter + cutWord;
        return string;
    }
}