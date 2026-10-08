const mongoose = require('mongoose');

const classifiedEventSchema = new mongoose.Schema({
  rawPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'RawPost' },
  sourceType: { 
    type: String, 
    default: 'AI_DETECTED'
  },
  title: { type: String },
  text: { type: String },
  url: { type: String },
  mediaUrl: { type: String },
  mediaEvidence: [{
    mediaId: { type: String },
    url: { type: String },
    type: { type: String }, // 'image' or 'video'
    originalName: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  category: { 
    type: String, 
    enum: ['flood', 'fire', 'cyclone', 'collapse', 'tsunami', 'medical', 'roadblock'],
    default: 'flood'
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  locationName: { type: String },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  priorityLevel: { 
    type: String, 
    enum: ['routine', 'urgent', 'emergency'],
    default: 'urgent'
  },
  peopleAffected: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 85 }, // 0-100
  clusterId: { type: String },
  verifiedByAgency: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['pending', 'pending_review', 'approved', 'rejected', 'response_assigned', 'responding', 'resolved', 'dismissed', 'overridden'], 
    default: 'pending_review' 
  },
  approvedBy: { type: String, default: '' },
  approvedAt: { type: Date },
  rejectedBy: { type: String, default: '' },
  rejectedAt: { type: Date },
  rejectionReason: { type: String, default: '' },
  assignedTeam: { type: String, default: '' },
  citizenName: { type: String, default: '' },
  citizenPhone: { type: String, default: '' },
  operatorNotes: [{
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    author: { type: String, default: 'Operator Dispatcher' }
  }],
  isSimulated: { type: Boolean, default: false }
}, { timestamps: true });

classifiedEventSchema.index({ location: '2dsphere' });
classifiedEventSchema.index({ sourceType: 1, status: 1 });
classifiedEventSchema.index({ severity: 1, confidenceScore: -1 });

module.exports = mongoose.model('ClassifiedEvent', classifiedEventSchema);
