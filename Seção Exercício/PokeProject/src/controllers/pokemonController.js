import Pokemon from "../models/PokeModel.js";

const initial = (req, res) => {
    res.render('pokemon');
};

const search = async (req, res, next) => {
    try {
        const pokemon = new Pokemon(req.body);
        const data = await pokemon.gatherData();

        if (!data) return res.render('404');
        if (pokemon.errors.length > 0) {
            req.session.save(() => {
                res.redirect('back');
            });
        }

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