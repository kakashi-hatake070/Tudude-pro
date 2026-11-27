import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    enum: ['IssueReport', 'Department', 'Officer', 'System']
  },
  entityId: {
    type: String,
    required: true,
    index: true
  },
  performedBy: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('AuditLog', auditLogSchema);
