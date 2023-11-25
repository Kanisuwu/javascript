// CommonJS
import { fileURLToPath as toURL } from 'url';
import path from 'path';

const __filename = toURL(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    entry: './frontend/main.js',
    output: {
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env'],
                },
            },
        }, {
            exclude: /node_modules/,
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        ],
    },
    devtool: 'source-map',
};