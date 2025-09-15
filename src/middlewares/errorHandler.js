class ErrorHandler {
    static handle(err, req, res, next) {
        console.error(err.stack);

        const error = {
            message: 'Ocorreu um erro interno no servidor',
            statusCode: 500
        };

        if (err.name === 'ValidationError') {
            error.message = err.message;
            error.statusCode = 400;
        } else if (err.message === 'Cliente não encontrado') {
            error.message = err.message;
            error.statusCode = 404;
        } else if (err.message === 'Saldo insuficiente') {
            error.message = err.message;
            error.statusCode = 400;
        }

        res.status(error.statusCode).json({ error: error.message });
    }
}

module.exports = ErrorHandler.handle;