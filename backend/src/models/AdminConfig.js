const mongoose = require('mongoose');

const AdminConfigSchema = new mongoose.Schema({
  confidenceThreshold: { type: Number, default: 70 }, // 70% min confidence score
  duplicateRadiusKm: { type: Number, default: 15 },
  autoDispatchEmergency: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
  keywordTriggers: { 
    type: [String], 
    default: ['sos', 'trapped', 'landslide', 'tsunami', 'cloudburst', 'collapse', 'chemical leak', 'dam breach'] 
  },
  feeds: {
    twitterStream: { type: Boolean, default: true },
    rssNews: { type: Boolean, default: true },
    emergencyHotline: { type: Boolean, default: true },
    radarWeather: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('AdminConfig', AdminConfigSchema);
