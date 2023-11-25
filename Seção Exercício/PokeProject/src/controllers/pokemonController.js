import Pokemon from "../models/PokeModel.js";

const initial = (req, res) => {
    res.render('pokemonHome');
};

const search = async (req, res) => {
    try {
        const pokemon = new Pokemon(req.body);
        await pokemon.searchPokemon();
    }
    catch (e) {
        console.log(e);
    }
};

export default {
    initial,
};