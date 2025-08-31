const AppError = require('../utils/AppError');

const validate = (schemas, part = null) => {
    return (req, res, next) => {
        if (part) {
        const { error, value } = schemas.validate(req[part], {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false,
        });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join('. ');
            return next(new AppError(errorMessage, 400));
        }

        req[part] = value;
        return next();
        }
        const parts = ['body', 'query', 'params'];

        for (const key of parts) {
            if (schemas[key]) {
                const { error, value } = schemas[key].validate(req[key], {
                    abortEarly: false,
                    stripUnknown: true,
                    allowUnknown: false,
                });

                if (error) {
                    const errorMessage = error.details.map((detail) => detail.message).join('. ');
                    return next(new AppError(errorMessage, 400));
                }

                req[key] = value;
            }
        }
        next();
    };
};

module.exports = validate;
