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

    async searchPokemon() {
        if (!this.body.name) return;
        // Try to contact the pokeAPI and check if was successful.
        try {
            const pokemon = await P.getPokemonByName(this.body.name);
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
    // Send pokemon information to the DB.
    async gatherPokemon() {
        if (this.errors.length > 0) return;
        const pokemon = this.searchPokemon();
        if (!pokemon) return;
        const pokeData = {
            name: pokemon.name,
            types: pokemon.types.forEach((index => {
                const array = [];
                array.push(index.type.name);
                return array;
            })),
            sprite: pokemon.sprites.front_default,
            stats: pokemon.stats.forEach(index => {
                const array = [];
                array.push({ amount: index.base_stat, stat: index.stat });
                return array;
            }),
        };
        return pokeData;
    }
}