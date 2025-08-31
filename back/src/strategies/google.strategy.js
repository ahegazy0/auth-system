const GoogleStrategy = require('passport-google-oauth20').Strategy;
const oauthService = require('../services/oauth.service');

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
        const { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } = 
            await oauthService.handleOAuthUser(profile, 'google');
        
        // Attach tokens to user object for controller access
        user._oauthTokens = { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
        done(null, user);
        } catch (error) {
        done(error, null);
        }
    }
);

module.exports = googleStrategy;