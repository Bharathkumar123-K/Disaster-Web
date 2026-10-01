const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  adminUser: { type: String, default: 'Super Admin (Level 0)' },
  action: { type: String, required: true }, // e.g. 'USER_CREATED', 'AI_THRESHOLD_UPDATED', 'INCIDENT_FORCE_DISMISSED', 'CUSTOM_INCIDENT_INJECTED'
  category: { type: String, enum: ['SECURITY', 'INGESTION', 'AI_ENGINE', 'INCIDENT_OVERRIDE', 'USER_MGMT'], default: 'SECURITY' },
  details: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
