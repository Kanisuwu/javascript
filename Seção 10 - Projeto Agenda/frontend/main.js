import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './assets/css/style.css';

import Login from './modules/login';
import Contact from './modules/contact';

// Login and Sign Up
const login = new Login('.form-login');
const signup = new Login('.form-signup');
const contact = new Contact('.contact-form');

// Register and Edit Contacts
contact.init();

// Initialize Login Methods
login.init();
signup.init();