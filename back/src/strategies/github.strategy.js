const GitHubStrategy = require('passport-github2').Strategy;
const oauthService = require('../services/oauth.service');

const githubStrategy = new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
        passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
        try {
        const { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } = 
            await oauthService.handleOAuthUser(profile, 'github');
        
        user._oauthTokens = { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
        done(null, user);
        } catch (error) {
        done(error, null);
        }
    }
);

module.exports = githubStrategy;