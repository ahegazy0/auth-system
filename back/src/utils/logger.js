const winston = require('winston');
const { combine, timestamp, json, errors, colorize, simple } = winston.format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    simple(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
    })
);

const logger = winston.createLogger({
    level: level(),
    levels,
    format: combine(
        errors({ stack: true }), 
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json()
    ),
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston.transports.Console({
            format: process.env.NODE_ENV === 'production' ? json() : consoleFormat,
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(timestamp(), json()),
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: combine(timestamp(), json()),
        }),
    ],
    exitOnError: false,
});

logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

module.exports = logger;