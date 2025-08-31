// email.service.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER
} = process.env;

class EmailService {
    constructor() {
        const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground" // redirect URI
        );

        oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
        this.oAuth2Client = oAuth2Client;
    }

    async createTransporter() {
        const accessToken = await this.oAuth2Client.getAccessToken();

        return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: GOOGLE_USER,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
        });
    }

    async sendVerificationEmail(to, name, verificationLink) {
        const transporter = await this.createTransporter();

        await transporter.sendMail({
        from: `Prisma Auth <${GOOGLE_USER}>`,
        to,
        subject: 'Verify Your Email',
        html: `
            <h2>Hello, ${name}</h2>
            <p>Thanks for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
        `,
        });
    }

    async sendPasswordResetEmail(to, name, resetLink) {
        const transporter = await this.createTransporter();

        await transporter.sendMail({
        from: `Prisma Auth <${GOOGLE_USER}>`,
        to,
        subject: 'Password Reset Request',
        html: `
            <h2>Hello, ${name}</h2>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 10 minutes.</p>
        `,
        });
    }
}

module.exports = new EmailService();