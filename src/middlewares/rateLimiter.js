class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.windowMs = 15 * 60 * 1000; // 15 minutos
        this.maxRequests = 100;
    }

    cleanupOldRequests() {
        const now = Date.now();
        for (let [ip, data] of this.requests) {
            if (now - data.windowStart > this.windowMs) {
                this.requests.delete(ip);
            }
        }
    }

    rateLimiter(req, res, next) {
        const ip = req.ip;
        const now = Date.now();

        this.cleanupOldRequests();

        if (!this.requests.has(ip)) {
            this.requests.set(ip, {
                windowStart: now,
                count: 1
            });
            return next();
        }

        const requestData = this.requests.get(ip);
        if (now - requestData.windowStart > this.windowMs) {
            requestData.windowStart = now;
            requestData.count = 1;
            return next();
        }

        requestData.count++;
        if (requestData.count > this.maxRequests) {
            return res.status(429).json({
                error: 'Too many requests, please try again later.'
            });
        }

        next();
    }
}

module.exports = new RateLimiter().rateLimiter.bind(new RateLimiter());