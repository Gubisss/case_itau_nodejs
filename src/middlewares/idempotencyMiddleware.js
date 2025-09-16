const idempotencyCache = new Map();

const idempotencyMiddleware = (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'];

    const idempotentPathsPrefixes = ['/clientes', '/clients']; // Prefixo comum
    const needsIdempotency = 
        idempotentPathsPrefixes.some(prefix => req.path.startsWith(prefix)) &&
        ['POST', 'PUT', 'PATCH'].includes(req.method);
        
    const isPostPutPatch = ['POST', 'PUT', 'PATCH'].includes(req.method);
    const pathRequiresIdempotency = req.path.includes('/sacar') || req.path.includes('/depositar'); // Verifica se a URL contém 'sacar' ou 'depositar'

    if (isPostPutPatch && pathRequiresIdempotency) {
        if (!idempotencyKey) {
            return res.status(400).json({
                error: 'Header "idempotency-key" é obrigatório para esta operação'
            });
        }

        const cachedResponse = idempotencyCache.get(idempotencyKey);
        if (cachedResponse) {
            console.log(`[Idempotência] Resposta detectada no cache para a chave: ${idempotencyKey}`);
            return res.status(cachedResponse.status).json(cachedResponse.data);
        }

        const originalSend = res.send;
        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                idempotencyCache.set(idempotencyKey, {
                    status: res.statusCode,
                    data: typeof data === 'string' ? JSON.parse(data) : data,
                    timestamp: Date.now()
                });

                setTimeout(() => {
                    idempotencyCache.delete(idempotencyKey);
                }, 24 * 60 * 60 * 1000); 
            }
            
            originalSend.call(this, data);
        };
    }

    next();
};

module.exports = idempotencyMiddleware;