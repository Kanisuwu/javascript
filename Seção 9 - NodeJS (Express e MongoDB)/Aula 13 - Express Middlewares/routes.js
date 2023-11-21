const express = require('express');
const route = express.Router();
const initialController = require('./src/controllers/homeController')
const contactController = require('./src/controllers/contactController')

// Middleware são requisições
const middleware = (req, res, next) => {
    console.log('Passei no Middleware')
    next();
};

// Home routes
route.get('/', middleware, initialController.initial);
route.post('/', initialController.handle);

// Contact routes
route.get('/contact', contactController.initial);

module.exports = route;