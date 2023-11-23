const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contactController = require('./src/controllers/contactController');

const { loginRequired } = require('./src/middlewares/MDW');

// Home routes
route.get('/', homeController.index);

// Login routes
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/log', loginController.login);
route.get('/login/logout', loginController.logout);

// Contact Routes
route.get('/contact/index', loginRequired, contactController.index);
route.post('/contact/register', loginRequired, contactController.register);
route.get('/contact/index/:id', loginRequired, contactController.editIndex);

module.exports = route;