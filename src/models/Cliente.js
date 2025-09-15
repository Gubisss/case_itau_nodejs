class Cliente {
    constructor(id, nome, email, saldo = 0) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.saldo = saldo;
    }

    sacar(valor) {
        if (valor <= 0) {
            throw new Error('Valor do saque deve ser positivo');
        }
        if (valor > this.saldo) {
            throw new Error('Saldo insuficiente');
        }
        this.saldo -= valor;
    }

    depositar(valor) {
        if (valor <= 0) {
            throw new Error('Valor do depósito deve ser positivo');
        }
        this.saldo += valor;
    }
}

module.exports = Cliente;