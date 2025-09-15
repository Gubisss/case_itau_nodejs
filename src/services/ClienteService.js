class ClienteService {
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    async listarClientes() {
        return await this.clienteRepository.findAll();
    }

    async buscarClientePorId(id) {
        const cliente = await this.clienteRepository.findById(id);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        return cliente;
    }

    async criarCliente(dados) {
        const { nome, email } = dados;
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios');
        }
        return await this.clienteRepository.create({ nome, email, saldo: 0 });
    }

    async atualizarCliente(id, dados) {
        const cliente = await this.buscarClientePorId(id);
        const { nome, email } = dados;
        if (!nome || !email) {
            throw new Error('Nome e email são obrigatórios');
        }
        await this.clienteRepository.update(id, { ...cliente, nome, email });
    }

    async deletarCliente(id) {
        await this.buscarClientePorId(id);
        await this.clienteRepository.delete(id);
    }

    async realizarDeposito(id, valor) {
        if (typeof valor !== 'number' || valor <= 0) {
            throw new Error('Valor do depósito deve ser um número positivo');
        }

        const novoSaldo = await this.clienteRepository.atualizarSaldoComTransacao(id, 'depositar', valor);
        const cliente = await this.buscarClientePorId(id);
        cliente.saldo = novoSaldo;
        return cliente;
    }

    async realizarSaque(id, valor) {
        if (typeof valor !== 'number' || valor <= 0) {
            throw new Error('Valor do saque deve ser um número positivo');
        }

        const novoSaldo = await this.clienteRepository.atualizarSaldoComTransacao(id, 'sacar', valor);
        const cliente = await this.buscarClientePorId(id);
        cliente.saldo = novoSaldo;
        return cliente;
    }
}

module.exports = ClienteService;