const AppError = require('../utils/AppError');
const logger = require('../utils/logger'); 

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};


const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Token expired. Please log in again.', 401);

/**
 * Log detailed errors internally.
 */
const logError = (err) => {
    const isOperational = err.isOperational || false;

    logger[isOperational ? 'warn' : 'error'](isOperational ? 'Handled Error' : 'Unhandled Exception', {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack,
    });
};

/**
 * Send clean error response to the client.
 */
const sendCleanError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logError(err);

    let error = { ...err, message: err.message };

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendCleanError(error, res);
};
