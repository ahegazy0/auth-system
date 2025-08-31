const Joi = require('joi');

const passwordComplexity = Joi.string().min(8).max(30).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'));

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
    }),

    email: Joi.string().email().lowercase().trim().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
    }),

    password: passwordComplexity.messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 30 characters',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),
    
    passwordConfirm: Joi.any().equal(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    })
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
    })
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
    })
});

const resetPasswordSchema = {
    query: Joi.object({
        token: Joi.string().required().label('Token'),
    }),
    body: Joi.object({
        password: passwordComplexity,
        passwordConfirm: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        }),
    }),
};

const verifyEmailSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Verification token is required',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema
};
