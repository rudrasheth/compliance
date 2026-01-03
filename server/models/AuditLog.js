import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['FILED', 'UPLOADED', 'VERIFIED', 'REMINDER', 'SYNC_FAILED', 'EXPORTED', 'CREATED', 'UPDATED', 'DELETED', 'REGISTERED', 'LOGIN', 'LOGOUT', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET', 'PASSWORD_CHANGED', 'PROFILE_UPDATED']
  },
  entity: {
    type: String,
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'entityType'
  },
  entityType: {
    type: String,
    enum: ['Filing', 'User', 'System']
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'pending', 'failed'],
    default: 'success'
  },
  details: {
    type: String
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for efficient queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, status: 1 });

export default mongoose.model('AuditLog', auditLogSchema);