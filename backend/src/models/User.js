const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  agency: { type: String, required: true, default: 'NDRF Central' },
  accountType: { type: String, enum: ['Admin', 'Operator', 'Citizen'], default: 'Operator', required: true },
  operationalRole: { type: String, enum: ['Dispatcher', 'Analyst', 'Commander', 'System Administrator', 'Citizen'], default: 'Dispatcher' },
  clearanceLevel: { type: Number, min: 1, max: 5, default: 1 },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  password: { type: String, required: true },
  isRootAdmin: { type: Boolean, default: false },
  createdBy: { type: String, default: 'Super Admin' },
  lastActive: { type: Date, default: Date.now },
  securityToken: { type: String, default: 'SEC-8849-NX' }
}, { timestamps: true });

// Exclude password by default in JSON output
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);

