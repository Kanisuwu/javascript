const express = require('express');
const route = express.Router();
const initialController = require('./controllers/homeController')
const contactController = require('./controllers/contactController')

// Home routes
route.get('/', initialController.initial);
route.post('/', initialController.handle);

// Contact routes
route.get('/contact', contactController.initial);

module.exports = route;