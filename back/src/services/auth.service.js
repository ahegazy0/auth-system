const User = require('../models/User.model');
const Token = require('../models/Token.model');
const AuditLog = require('../models/AuditLog.model');
const AppError = require('../utils/AppError');
const { hashPassword, comparePasswords } = require('../utils/bcrypt');
const tokenService = require('./token.service');
const emailService = require('./email.service');

class AuthService {
    /**
     * Registers a new user with email and password.
     * @param {Object} userData - The user's registration data.
     * @returns {Promise<Object>} The created user and their tokens.
     */
    async register(userData) {
        const { name, email, password } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('A user with this email already exists.', 409);
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isEmailVerified: false,
        });

        const emailVerificationToken = tokenService.generateToken(user._id, 'emailVerification');

        await Token.create({
            token: emailVerificationToken,
            userId: user._id,
            type: 'emailVerification',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

        await emailService.sendVerificationEmail(user.email, user.name, verificationURL);

        user.password = undefined;

        return { user };
    }

    /**
     * Logs in a user with email and password.
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @param {Object} clientInfo - Client information for auditing (ip, userAgent).
     * @returns {Promise<Object>} The authenticated user and their tokens.
     */
    async login(email, password, clientInfo = {}) {

        const user = await User.findOne({ email }).select('+password');
        const isPasswordCorrect = user ? await comparePasswords(password,user.password) : false;

        if (!user || !isPasswordCorrect) {
            await AuditLog.create({
                action: 'login_failed',
                status: 'failure',
                metadata: { email, reason: 'Invalid credentials' },
                ...clientInfo,
            });
            throw new AppError('Incorrect email or password', 401);
        }

        if (!user.isEmailVerified) {
            throw new AppError('Please verify your email address to login.', 401);
        }

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false }); // Save without running validators

        const accessToken = tokenService.generateToken(user._id, 'access');
        const refreshToken = tokenService.generateToken(user._id, 'refresh');

        await tokenService.storeRefreshToken(user._id, refreshToken);

        user.password = undefined;

        await AuditLog.create({
            action: 'login',
            userId: user._id,
            status: 'success',
            ...clientInfo,
        });

        return { user, accessToken, refreshToken };
    }

    /**
     * Logs out a user by invalidating their refresh token.
     * @param {string} refreshToken - The refresh token to invalidate.
     * @returns {Promise<void>}
     */
    async logout(refreshToken) {
        await tokenService.removeRefreshToken(refreshToken);
    }

    /**
     * Refreshes an access token using a valid refresh token.
     * @param {string} refreshToken - The refresh token.
     * @returns {Promise<Object>} A new access token.
     */
    async refreshAuth(refreshToken) {
        const userId = await tokenService.verifyRefreshToken(refreshToken);

        const newAccessToken = tokenService.generateToken(userId, 'access');

        const newRefreshToken = tokenService.generateToken(userId, 'refresh');
        await tokenService.removeRefreshToken(refreshToken); // Delete the old one
        await tokenService.storeRefreshToken(userId, newRefreshToken); // Store the new one
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    }

    /**
     * Initiates a password reset process.
     * @param {string} email - The user's email.
     * @returns {Promise<void>}
     */
    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) return;

        const resetToken = tokenService.generateToken(user._id, 'passwordReset'); // You'd need to add this type to your token.service

        await Token.create({
            token: resetToken,
            userId: user._id,
            type: 'passwordReset',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        await emailService.sendPasswordResetEmail(user.email, user.name, resetURL);
    }

    /**
     * Resets a user's password using a valid token.
     * @param {string} token - The password reset token.
     * @param {string} newPassword - The new password.
     * @returns {Promise<void>}
     */
    async resetPassword(token, newPassword) {
        let decoded;
        try {
            decoded = await tokenService.verifyToken(token, 'passwordReset');
        } catch (error) {
            throw new AppError('Password reset token is invalid or has expired', 400);
        }

        const tokenDoc = await Token.findOne({token: token, type: 'passwordReset', userId: decoded.id,});

        if (!tokenDoc) {
            throw new AppError('Password reset token is invalid or has expired', 400);
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new AppError('User no longer exists', 400);
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        await tokenService.removeAllRefreshTokensForUser(user._id);

        await Token.findByIdAndDelete(tokenDoc._id);
    }

    /**
     * Verifies a user's email address using a verification token.
     * @param {string} token - The email verification token.
     * @returns {Promise<Object>} The updated user object.
     */
    async verifyEmail(token) {

        let decoded;

        try {
            decoded = await tokenService.verifyToken(token, 'emailVerification');
        } catch (err) {
            throw new AppError('Email verification token is invalid or expired.', 400);
        }

        const tokenDoc = await Token.findOne({ token: token, type: 'emailVerification', userId: decoded.id });

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (user.isEmailVerified) {
            throw new AppError('Email already verified.', 400);
        }

        user.isEmailVerified = true;

        await user.save({ validateBeforeSave: false });
        if (tokenDoc) await Token.findByIdAndDelete(tokenDoc._id);
        return user;
    }
}

module.exports = new AuthService();