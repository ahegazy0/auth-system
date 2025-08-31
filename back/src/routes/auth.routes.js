const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');
const {registerSchema,loginSchema,refreshTokenSchema,forgotPasswordSchema,resetPasswordSchema,verifyEmailSchema} = require('../validations/auth.validation');

const authController = require('../controllers/auth.controller');

router.use(authLimiter);

//API Routes
router.post('/register', validate({body : registerSchema}), authController.register);
router.post('/login', validate({body: loginSchema}), authController.login);

router.post('/refresh-token', validate({body: refreshTokenSchema}), authController.refreshToken);
router.post('/forgot-password', validate({body: forgotPasswordSchema}), authController.forgotPassword);

router.patch('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/verify-email', validate({body: verifyEmailSchema}), authController.verifyEmail);

// OAuth Routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

router.get('/microsoft', authController.microsoftLogin);
router.get('/microsoft/callback', authController.microsoftCallback);

//Protected
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getMe);



module.exports = router;
