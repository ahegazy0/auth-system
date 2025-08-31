const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            const o = this.oauth || {};
            const hasOAuth = !!(o.google?.id || o.github?.id || o.microsoft?.id);
            return !hasOAuth; 
        }, 
        minlength: 6,
        select: false
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: { type: Date },
    oauth: {
        google: {
            id: String,
            email: { type: String },
            name: { type: String },
            picture: { type: String },
            profileUrl: { type: String }
        },
        github: {
            id: String,
            email: { type: String },
            name: { type: String },
            picture: { type: String },
            profileUrl: { type: String }
        },
        microsoft: {
            id: String,
            email: { type: String },
            name: { type: String },
            picture: { type: String },
            profileUrl: { type: String }
        }
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema,'users');

module.exports = User;