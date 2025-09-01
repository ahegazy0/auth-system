const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const passport = require('../config/passport');
const AppError = require('../utils/AppError');

class AuthController {
    // @desc    Register a new user
    // @route   POST /api/v1/auth/register
    // @access  Public
    register = asyncHandler(async (req, res) => {
        const { user } = await authService.register(req.body);
        const response = new ApiResponse(
            201,
            { user },
            'User registered successfully. Please check your email to verify your account.'
        );

        res.status(response.statusCode).json(response);
    });

    // @desc    Login user
    // @route   POST /api/v1/auth/login
    // @access  Public
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const clientInfo = {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        };

        const { user, accessToken, refreshToken } = await authService.login(email, password, clientInfo);

        this._setRefreshTokenCookie(res, refreshToken);

        const response = new ApiResponse(200, { 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }, 
            accessToken 
        }, 'Login successful');
        
        res.status(response.statusCode).json(response);
    });

    // @desc    Logout user / clear cookie
    // @route   POST /api/v1/auth/logout
    // @access  Private
    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
        });

        const response = new ApiResponse(200, null, 'Logged out successfully');
        res.status(response.statusCode).json(response);
    });

    // @desc    Refresh Access Token
    // @route   POST /api/v1/auth/refresh-token
    // @access  Public (needs valid refresh token)
    refreshToken = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAuth(refreshToken);

        if (newRefreshToken) {
            this._setRefreshTokenCookie(res, newRefreshToken);
        }

        const response = new ApiResponse(200, { accessToken }, 'Access token refreshed');
        res.status(response.statusCode).json(response);
    });

    // @desc    Forgot Password
    // @route   POST /api/v1/auth/forgot-password
    // @access  Public
    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;

        await authService.forgotPassword(email);

        const response = new ApiResponse(
            200,
            null,
            'If an account with that email exists, a password reset link has been sent.'
        );
        res.status(response.statusCode).json(response);
    });

    // @desc    Reset Password
    // @route   PATCH /api/v1/auth/reset-password
    // @access  Public
    resetPassword = asyncHandler(async (req, res) => {
        // Note: Use req.query.token for the token if you expect it in query params,
        // or req.body.token if in request body - here I keep your updated code using req.query.token
        const { token } = req.query;
        const { password } = req.body;

        await authService.resetPassword(token, password);

        const response = new ApiResponse(200, null, 'Password has been reset successfully');
        res.status(response.statusCode).json(response);
    });

    // @desc    Verify Email
    // @route   GET /api/v1/auth/verify-email
    // @access  Public
    verifyEmail = asyncHandler(async (req, res) => {
        const { token } = req.query;

        const user = await authService.verifyEmail(token);

        const response = new ApiResponse(200, { 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        }, 'Email verified successfully');
        
        res.status(response.statusCode).json(response);
    });

    // @desc    Get current logged-in user
    // @route   GET /api/v1/auth/me
    // @access  Private
    getMe = asyncHandler(async (req, res) => {
        const user = req.user;

        const response = new ApiResponse(200, { 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        }, 'Current user retrieved');
        
        res.status(response.statusCode).json(response);
    });

    // OAuth Methods (fixed to avoid asyncHandler wrapping passport.authenticate)

    initiateOAuth = (provider) => {
        const scopes = {
            google: ['profile', 'email'],
            github: ['user:email'],
            microsoft: ['user.read'],
        };
        return passport.authenticate(provider, {
            session: false,
            scope: scopes[provider] // GitHub needs this scope; adjust per provider
        });
    };

    handleOAuthCallback = (provider) => (req, res, next) => {
        passport.authenticate(provider, { session: false }, (err, user, info) => {
            if (err || !user) {
                return next(new AppError(`OAuth authentication with ${provider} failed`, 401));
            }

            // Get tokens attached to user by Passport strategy
            const { accessToken, refreshToken } = user._oauthTokens || {};

            if (!accessToken || !refreshToken) {
                return next(new AppError('OAuth token generation failed', 500));
            }

            this._setRefreshTokenCookie(res, refreshToken);

            if (req.get('Accept')?.includes('application/json')) {
                const response = new ApiResponse(200, {
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                    },
                    accessToken,
                }, `${provider} OAuth login successful`);

                return res.status(response.statusCode).json(response);
            } else {
                // Browser redirect with tokens in query params (adjust FRONTEND_URL)
                return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
            }
        })(req, res, next);
    };

    // Google OAuth routes
    googleLogin = this.initiateOAuth('google');
    googleCallback = this.handleOAuthCallback('google');

    // GitHub OAuth routes
    githubLogin = this.initiateOAuth('github');
    githubCallback = this.handleOAuthCallback('github');

    // Microsoft OAuth routes
    microsoftLogin = this.initiateOAuth('microsoft');
    microsoftCallback = this.handleOAuthCallback('microsoft');

    // Helper to set refresh token cookie securely
    _setRefreshTokenCookie(res, token) {
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_REFRESH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: true,
            sameSite: isProduction ? 'none' : 'lax',
            path:'/',
        };

        res.cookie('refreshToken', token, cookieOptions);
    }
}

module.exports = new AuthController();
