// npm init -y
// npm install --save-dev @babel/cli @babel/preset-env @babel/core

// a flag [--save-dev] migra as dependências para dependência de DEVs.

class person {
    constructor(name, lastname, age) {
        this.name = name;
        this.lastname = lastname;
        this.age = age;
    }
}

// npx babel index.js -o bundle.js --presets=@babel/env