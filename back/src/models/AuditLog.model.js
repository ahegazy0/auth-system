const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['login', 'login_failed', 'logout', 'password_change', 'profile_update']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ipAddress: String,
    userAgent: String,
    status: {
        type: String,
        enum: ['success', 'failure'],
        required: true
    },
    metadata: mongoose.Schema.Types.Mixed 
}, {
    timestamps: true
});


auditLogSchema.index({ userId: 1, action: 1 });
auditLogSchema.index({ createdAt: 1 }); 

const AuditLog = mongoose.model('AuditLog', auditLogSchema, 'audits');

module.exports = AuditLog;