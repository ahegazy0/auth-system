const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    if (req.originalUrl === '/api/health' || req.originalUrl.includes('.')) {
        return next();
    }

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            contentLength: res.get('Content-Length'),
            userId: req.user?._id || 'anonymous',
        };

        if (res.statusCode >= 400) {
            logger.warn('HTTP Request Warning', logData);
        } else {
            logger.info('HTTP Request', logData);
        }
    });

    next();
};

module.exports = requestLogger;