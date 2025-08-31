require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/database');
const passport = require('./config/passport');
const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const requestLogger = require('./middlewares/requestLogger.middleware');
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const notFoundRoutseMiddleware = require('./middlewares/notFoundRoutes.middleware');

const authRoutes = require('./routes/auth.routes');

class App {
    constructor() {
        this.app = express();
        this.connectDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    connectDatabase() {
        connectDB();
    }

    initializeMiddlewares() {
        this.app.use(helmet());

        this.app.set('trust proxy', 1);

        const limiter = rateLimit({windowMs: 15 * 60 * 1000,max: 100,message: 'Too many requests from this IP, please try again later.',standardHeaders: true,legacyHeaders: false,});
        this.app.use(limiter);

        this.app.use('/api/v1/auth', apiLimiter);


        this.app.use(cors({
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL 
            : ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        }));

        this.app.use(express.json({ limit: '10kb' }));
        
        this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));

        this.app.use(cookieParser());

        this.app.use(passport.initialize());

        this.app.use(requestLogger);
    }

    initializeRoutes() {

        this.app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Server is up and running!',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
        });

        this.app.use('/api/v1/auth', authRoutes);

        this.app.use(notFoundRoutseMiddleware);
    }

    initializeErrorHandling() {
        this.app.use(errorHandlerMiddleware);
    }
}

module.exports = new App().app;