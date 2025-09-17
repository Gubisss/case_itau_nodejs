const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { body } = require('express-validator');
const rateLimiter = require('./middlewares/RateLimiter');

const database = require('./config/database');
const ClienteController = require('./controllers/ClienteController');
const ClienteService = require('./services/ClienteService');
const ClienteRepository = require('./repositories/ClienteRepository');
const idempotencyMiddleware = require('./middlewares/idempotencyMiddleware');

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use(idempotencyMiddleware);

// Injeção de dependências
const clienteRepository = new ClienteRepository(database.getInstance());
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

// Validações
const clienteValidations = [
    body('nome').notEmpty().trim().withMessage('Nome é obrigatório'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido')
];

const valorValidation = [
    body('valor')
        .isFloat({ gt: 0 })
        .withMessage('Valor deve ser um número positivo')
];

// Rotas
app.get('/clientes', (req, res) => clienteController.listarClientes(req, res));
app.get('/clientes/:id', (req, res) => clienteController.buscarClientePorId(req, res));
app.post('/clientes', clienteValidations, (req, res) => clienteController.criarCliente(req, res));
app.put('/clientes/:id', clienteValidations, (req, res) => clienteController.atualizarCliente(req, res));
app.delete('/clientes/:id', (req, res) => clienteController.deletarCliente(req, res));
app.post('/clientes/:id/depositar', valorValidation, (req, res) => clienteController.realizarDeposito(req, res));
app.post('/clientes/:id/sacar', valorValidation, (req, res) => clienteController.realizarSaque(req, res));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;