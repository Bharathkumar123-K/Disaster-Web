const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassifiedEvent', required: true },
  suggestedDepartment: { type: String, enum: ['Fire', 'Police', 'SDRF', 'NDRF', 'Ambulance', 'Coast Guard'] },
  priorityLevel: { type: String, enum: ['routine', 'urgent', 'emergency'] },
  suggestedResources: [{ type: String }],
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
