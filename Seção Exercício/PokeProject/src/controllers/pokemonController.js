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
        const possibleEvolutions = [];

        for (const index in pokemon.info.evolutionChain.evolves_to) {
            const name = pokemon.info.evolutionChain.evolves_to[index].name;
            const pokemonClass = new Pokemon({ name: name });
            await pokemonClass.gatherData();
            possibleEvolutions.push({
                name: pokemonClass.info.name,
                sprite: pokemonClass.info.sprite,
            });
        }

        res.locals.data.possibleEvolutions = possibleEvolutions ? possibleEvolutions : [];
        console.log(res.locals.data.possibleEvolutions);
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