const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  adminUser: { type: String, default: 'Super Admin' },
  targetUser: { type: String, default: '' },
  action: { type: String, required: true }, // e.g. 'USER_CREATED', 'USER_UPDATED', 'ROLE_CHANGED', 'CLEARANCE_CHANGED', 'USER_SUSPENDED', 'USER_ACTIVATED', 'USER_DELETED'
  category: { type: String, enum: ['SECURITY', 'INGESTION', 'AI_ENGINE', 'INCIDENT_OVERRIDE', 'USER_MGMT'], default: 'USER_MGMT' },
  previousValue: { type: String, default: '' },
  newValue: { type: String, default: '' },
  details: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);

