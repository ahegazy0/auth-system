const MicrosoftStrategy = require('passport-microsoft').Strategy;
const oauthService = require('../services/oauth.service');

const microsoftStrategy = new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL,
        scope: ['user.read'],
        passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
        const { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } = 
            await oauthService.handleOAuthUser(profile, 'microsoft');
        
        user._oauthTokens = { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
        done(null, user);
        } catch (error) {
        done(error, null);
        }
    }
);

module.exports = microsoftStrategy;