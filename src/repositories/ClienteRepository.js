const Cliente = require('../models/Cliente');
const transactionQueue = require('../utils/TransactionQueue');

class ClienteRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM clientes', [], (err, rows) => {
                if (err) return reject(err);
                const clientes = rows.map(row => new Cliente(row.id, row.nome, row.email, row.saldo));
                resolve(clientes);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(new Cliente(row.id, row.nome, row.email, row.saldo));
            });
        });
    }

    async create(cliente) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO clientes (nome, email, saldo) VALUES (?, ?, ?)',
                [cliente.nome, cliente.email, cliente.saldo],
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async update(id, cliente) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE clientes SET nome = ?, email = ? WHERE id = ?',
                [cliente.nome, cliente.email, id],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM clientes WHERE id = ?', [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    async atualizarSaldoComTransacao(id, operacao, valor) {
        const runQuery = (query, params) => {
            return new Promise((resolve, reject) => {
                this.db.run(query, params, function(err) {
                    if (err) reject(err);
                    else resolve(this);
                });
            });
        };

        const getQuery = (query, params) => {
            return new Promise((resolve, reject) => {
                this.db.get(query, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        };

        // Coloca a operação na fila de transações
        return transactionQueue.enqueue(async () => {
            try {
                // Inicia a transação
                await runQuery('BEGIN TRANSACTION', []);

                // Busca o saldo atual
                const row = await getQuery('SELECT saldo FROM clientes WHERE id = ?', [id]);
                
                if (!row) {
                    await runQuery('ROLLBACK', []);
                    throw new Error('Cliente não encontrado');
                }

                let novoSaldo;
                if (operacao === 'sacar') {
                    if (row.saldo < valor) {
                        await runQuery('ROLLBACK', []);
                        throw new Error('Saldo insuficiente');
                    }
                    novoSaldo = row.saldo - valor;
                } else if (operacao === 'depositar') {
                    novoSaldo = row.saldo + valor;
                }

                // Atualiza o saldo
                await runQuery('UPDATE clientes SET saldo = ? WHERE id = ?', [novoSaldo, id]);
                
                // Confirma a transação
                await runQuery('COMMIT', []);
                
                return novoSaldo;
            } catch (error) {
                // Em caso de erro, faz rollback
                try {
                    await runQuery('ROLLBACK', []);
                } catch (rollbackError) {
                    console.error('Erro no rollback:', rollbackError);
                }
                throw error;
            }
        });
    }
}

module.exports = ClienteRepository;