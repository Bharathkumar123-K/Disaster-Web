const mongoose = require('mongoose');

const classifiedEventSchema = new mongoose.Schema({
  rawPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'RawPost' },
  sourceType: { type: String },
  text: { type: String },
  url: { type: String },
  category: { type: String, enum: ['flood', 'fire', 'cyclone', 'collapse', 'tsunami', 'medical', 'roadblock'] },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  locationName: { type: String },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  peopleAffected: { type: Number },
  confidenceScore: { type: Number }, // 0-100
  clusterId: { type: String },
  verifiedByAgency: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'dismissed', 'overridden'], default: 'pending' }
}, { timestamps: true });

classifiedEventSchema.index({ location: '2dsphere' });
classifiedEventSchema.index({ severity: 1, confidenceScore: -1 });

module.exports = mongoose.model('ClassifiedEvent', classifiedEventSchema);
