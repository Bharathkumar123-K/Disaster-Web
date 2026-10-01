const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  agency: { type: String, required: true }, // NDRF, SDRF, FEMA, Coast Guard, Fire & Rescue
  role: { type: String, enum: ['Admin', 'Commander', 'Dispatcher', 'Analyst', 'Observer'], default: 'Dispatcher' },
  clearanceLevel: { type: Number, min: 1, max: 5, default: 3 },
  status: { type: String, enum: ['Active', 'Suspended', 'Pending Verification'], default: 'Active' },
  lastActive: { type: Date, default: Date.now },
  securityToken: { type: String, default: 'SEC-8849-NX' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
