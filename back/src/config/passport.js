const passport = require('passport');
const GoogleStrategy = require('../strategies/google.strategy');
const GitHubStrategy = require('../strategies/github.strategy');
const MicrosoftStrategy = require('../strategies/microsoft.strategy');
const User = require('../models/User.model');

passport.serializeUser((user, done) => {
    done(null, user._id || user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use('google', GoogleStrategy);
passport.use('github', GitHubStrategy);
passport.use('microsoft', MicrosoftStrategy);

module.exports = passport;