import Pokemon from "../models/PokeModel.js";

const initial = (req, res) => {
    res.render('pokemon');
};

const search = async (req, res, next) => {
    try {
        const pokemon = new Pokemon(req.body);
        await pokemon.gatherData();

        if (pokemon.errors.length > 0) {
            req.session.save(() => {
                res.redirect('back');
            });
        }

        res.locals.data = pokemon.info;

        next();
    }
    catch (e) {
        console.error('Error while searching for pokemon:', e);
        res.redirect('/');
    }
};

export default {
    initial,
    search,
};