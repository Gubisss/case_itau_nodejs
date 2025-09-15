const { body, param, validationResult } = require('express-validator');

class ValidationMiddleware {
    static validateClienteCreate() {
        return [
            body('nome')
                .trim()
                .notEmpty()
                .withMessage('Nome é obrigatório')
                .isLength({ min: 3 })
                .withMessage('Nome deve ter pelo menos 3 caracteres')
                .escape(),
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email é obrigatório')
                .isEmail()
                .withMessage('Email inválido')
                .normalizeEmail(),
        ];
    }

    static validateClienteUpdate() {
        return [
            param('id')
                .isInt()
                .withMessage('ID inválido'),
            ...ValidationMiddleware.validateClienteCreate()
        ];
    }

    static validateOperacaoFinanceira() {
        return [
            param('id')
                .isInt()
                .withMessage('ID inválido'),
            body('valor')
                .isFloat({ gt: 0 })
                .withMessage('Valor deve ser um número positivo')
                .custom((value) => {
                    // Limita a 2 casas decimais
                    if (value !== Number(value.toFixed(2))) {
                        throw new Error('Valor deve ter no máximo 2 casas decimais');
                    }
                    return true;
                })
        ];
    }

    static validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
}

module.exports = ValidationMiddleware;