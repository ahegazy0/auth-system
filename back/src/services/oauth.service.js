const User = require('../models/User.model');
const Token = require('../models/Token.model');
const AuditLog = require('../models/AuditLog.model');
const AppError = require('../utils/AppError');
const tokenService = require('./token.service');

class OAuthService {
    /**
     * Find or create user from OAuth profile
     * @param {Object} profile - OAuth profile data
     * @param {string} provider - OAuth provider name
     * @returns {Promise<Object>} User and tokens
     */
    async handleOAuthUser(profile, provider) {
        try {

        let user = await User.findOne({ 
            [`oauth.${provider}.id`]: profile.id 
        });

        if (user) {
            return await this._handleExistingUser(user, provider, profile);
        }

        if (profile.emails && profile.emails[0].value) {
            user = await User.findOne({ 
            email: profile.emails[0].value 
            });

            if (user) {
                return await this._mergeOAuthAccount(user, provider, profile);
            }
        }

        return await this._createOAuthUser(profile, provider);
        } catch (error) {
            throw new AppError(`OAuth authentication failed: ${error.message}`, 400);
        }
    }

    async _handleExistingUser(user, provider, profile) {
        user.oauth[provider] = this._mapProfileToUser(profile);
        await user.save({ validateBeforeSave: false });
        
        return await this._generateUserTokens(user);
    }

    async _mergeOAuthAccount(user, provider, profile) {
        user.oauth[provider] = this._mapProfileToUser(profile);
        await user.save({ validateBeforeSave: false });
        
        return await this._generateUserTokens(user);
    }

    async _createOAuthUser(profile, provider) {
        const userData = {
        email: profile.emails[0].value,
        name: profile.displayName || profile.username,
        isEmailVerified: true,
        oauth: {
            [provider]: this._mapProfileToUser(profile)
        }
        };

        const user = await User.create(userData);
        return await this._generateUserTokens(user);
    }

    _mapProfileToUser(profile) {
        return {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName || profile.username,
        picture: profile.photos?.[0]?.value,
        profileUrl: profile.profileUrl
        };
    }

    async _generateUserTokens(user) {
        const accessToken = tokenService.generateToken(user._id, 'access');
        const refreshToken = tokenService.generateToken(user._id, 'refresh');
        
        await tokenService.storeRefreshToken(user._id, refreshToken);
        
        return { user, accessToken, refreshToken };
    }
}

module.exports = new OAuthService();