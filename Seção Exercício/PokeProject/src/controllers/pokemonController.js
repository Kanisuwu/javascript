import Pokemon from "../models/PokeModel.js";

const initial = (req, res) => {
    res.render('pokemonHome');
};

const search = async (req, res, next) => {
    try {
        const pokemon = new Pokemon(req.body);
        const data = await pokemon.gatherData();
        if (!data) return res.render('404');
        res.locals.data = data;
        next();
    }
    catch (e) {
        console.log(e);
        res.render('404');
    }
};

export default {
    initial,
    search,
};