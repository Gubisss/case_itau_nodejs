const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor() {
        this.db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err);
            } else {
                console.log('Conectado ao banco de dados SQLite');
                this.initDatabase();
            }
        });
    }

    initDatabase() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS clientes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    saldo FLOAT DEFAULT 0
                )
            `);
        });
    }

    getInstance() {
        return this.db;
    }
}

module.exports = new Database();