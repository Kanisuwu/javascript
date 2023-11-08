class Remote {
    constructor(tv) {
        this.tv = tv;
        this.volume = 0;
    }
    riseV() {
        this.volume += 2;
    }
    // Método de instância
    downV() {
        this.volume -= 2;
    }
    // Método Estático --> Não relaciona com a instância
    static zeroVolume() {
        // Não tem acesso ao construtor pois não é criado com NEW.
    }
}

const remote1 = new Remote('LG');
const remote2 = new Remote('Samsung');

remote1.riseV();
remote2.riseV();
console.log(remote1);
console.log(remote2);
Remote.zeroVolume();
console.log(remote1);
console.log(remote2);