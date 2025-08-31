const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const tokenService = require('../services/token.service');
const User = require('../models/User.model');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Authentication required. Please log in.', 401));
    }

    const decoded = await tokenService.verifyToken(token, 'access');
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
        return next(new AppError('User no longer exists.', 401));
    }

    req.user = currentUser;
    next();
});

module.exports = authMiddleware;