import 'dotenv/config';

// Imports
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import csrf from 'csurf';
import path from 'path';
import helmet from 'helmet';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import routes from './routes.js';

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        console.log('CONNECTED TO DATABASE.');
        app.emit('DONE');
    })
    .catch(e => console.log(e));

const app = express();

const __filename = import.meta.url;
const __dirname = fileURLToPath(__filename);

const sessionOptions = session({
    secret: 'OwO?',
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_STRING,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(sessionOptions);
app.use(flash());


app.set('views', path.resolve(__dirname, '..', 'src', 'views'));
app.set('view engine', 'ejs');

app.use(routes);

app.on('DONE', () => {
    app.listen(3000, () => {
        console.log('http://localhost:3000');
        console.log('Server being executed in port 3000.');
    });
});