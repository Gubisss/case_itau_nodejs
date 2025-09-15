const { validationResult } = require('express-validator');

class ClienteController {
    constructor(clienteService) {
        this.clienteService = clienteService;
    }

    async listarClientes(req, res) {
        try {
            const clientes = await this.clienteService.listarClientes();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar clientes' });
        }
    }

    async buscarClientePorId(req, res) {
        try {
            const cliente = await this.clienteService.buscarClientePorId(req.params.id);
            res.json(cliente);
        } catch (error) {
            if (error.message === 'Cliente não encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro ao buscar cliente' });
            }
        }
    }

    async criarCliente(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const id = await this.clienteService.criarCliente(req.body);
            res.status(201).json({ id });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async atualizarCliente(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            await this.clienteService.atualizarCliente(req.params.id, req.body);
            res.status(200).json({ message: 'Cliente atualizado com sucesso' });
        } catch (error) {
            if (error.message === 'Cliente não encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async deletarCliente(req, res) {
        try {
            await this.clienteService.deletarCliente(req.params.id);
            res.status(200).json({ message: 'Cliente removido com sucesso' });
        } catch (error) {
            if (error.message === 'Cliente não encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro ao remover cliente' });
            }
        }
    }

    async realizarDeposito(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const cliente = await this.clienteService.realizarDeposito(
                req.params.id,
                parseFloat(req.body.valor)
            );
            res.json(cliente);
        } catch (error) {
            if (error.message === 'Cliente não encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async realizarSaque(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const cliente = await this.clienteService.realizarSaque(
                req.params.id,
                parseFloat(req.body.valor)
            );
            res.json(cliente);
        } catch (error) {
            if (error.message === 'Cliente não encontrado') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Saldo insuficiente') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }
}

module.exports = ClienteController;