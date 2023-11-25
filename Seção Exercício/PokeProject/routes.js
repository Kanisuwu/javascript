import express from 'express';

import indexController from './src/controllers/indexController.js';
import pokemonController from './src/controllers/pokemonController.js';

const route = express.Router();

// Home Routes
route.get('/', indexController.initial);

// Pokemon Routes
route.get('/pokemons', pokemonController.initial);

export default route;