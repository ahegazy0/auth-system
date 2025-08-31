const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const Token = require('../models/Token.model');

class TokenService {
    /**
     * Generates a JWT token.
     * @param {mongoose.Types.ObjectId} userId - The user ID to embed in the token.
     * @param {string} type - The token type ('access' or 'refresh').
     * @returns {string} The signed JWT token.
     */
    generateToken(userId, type) {
        const secrets = {
            access: process.env.JWT_ACCESS_SECRET,
            refresh: process.env.JWT_REFRESH_SECRET,
            passwordReset: process.env.JWT_PASSWORD_RESET_SECRET,
            emailVerification: process.env.JWT_EMAIL_VERIFICATION_SECRET 
        };
        const expiresIn = {
            access: process.env.JWT_ACCESS_EXPIRES_IN,
            refresh: process.env.JWT_REFRESH_EXPIRES_IN,
            passwordReset: '10m',
            emailVerification : '1d'
        };

        const secret = secrets[type];
        const expiresInValue = expiresIn[type];

        if (!secret) {
            throw new AppError(`JWT secret for ${type} token is not defined`, 500);
        }

        return jwt.sign({ id: userId }, secret, {expiresIn: expiresInValue,});
    }

    /**
     * Verifies a JWT token and returns its payload.
     * @param {string} token - The JWT token to verify.
     * @param {string} type - The token type ('access' or 'refresh').
     * @returns {Promise<Object>} The decoded token payload.
     */
    async verifyToken(token, type) {
        const secrets = {
            access: process.env.JWT_ACCESS_SECRET,
            refresh: process.env.JWT_REFRESH_SECRET,
            passwordReset: process.env.JWT_PASSWORD_RESET_SECRET,
            emailVerification: process.env.JWT_EMAIL_VERIFICATION_SECRET 
        };

        const secret = secrets[type];

        if (!secret) {
            throw new AppError(`JWT secret for ${type} token is not defined`, 500);
        }

        try {
            return jwt.verify(token, secret);
        } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError(`${type} token has expired`, 401);
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError(`Invalid ${type} token`, 401);
        }
        throw new AppError('Token verification failed', 401);
        }
    }

    /**
     * Stores a refresh token in the database for a specific user.
     * @param {mongoose.Types.ObjectId} userId - The user ID associated with the token.
     * @param {string} refreshToken - The refresh token to store.
     * @returns {Promise<Object>} The saved token document.
     */
    async storeRefreshToken(userId, refreshToken) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '7d'));

        const tokenDoc = await Token.create({
            token: refreshToken,
            userId: userId,
            type: 'refresh',
            expiresAt: expiresAt,
        });

        return tokenDoc;
    }

    /**
     * Finds a refresh token in the database and validates it's still valid.
     * @param {string} refreshToken - The refresh token to find.
     * @returns {Promise<Object>} The token document if found and valid.
     */
    async verifyRefreshToken(refreshToken) {
        const tokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh' }).populate('userId');
        if (!tokenDoc) {
            throw new AppError('Refresh token not found in database', 401);
        }

        if (tokenDoc.expiresAt < new Date()) {
            await Token.findByIdAndDelete(tokenDoc._id);
            throw new AppError('Refresh token has expired', 401);
        }

        return tokenDoc.userId;
    }

    /**
     * Deletes a refresh token from the database (logout functionality).
     * @param {string} refreshToken - The refresh token to delete.
     * @returns {Promise<void>}
     */
    async removeRefreshToken(refreshToken) {
        await Token.findOneAndDelete({ token: refreshToken, type: 'refresh' });
    }

    /**
     * Deletes all refresh tokens for a specific user (e.g., on password change).
     * @param {mongoose.Types.ObjectId} userId - The user ID.
     * @returns {Promise<void>}
     */
    async removeAllRefreshTokensForUser(userId) {
        await Token.deleteMany({ userId: userId, type: 'refresh' });
    }
}

module.exports = new TokenService();