const express = require('express');
const router = express.Router();
const ClassifiedEvent = require('../models/ClassifiedEvent');
const RawPost = require('../models/RawPost');
const Recommendation = require('../models/Recommendation');

// Public active alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await ClassifiedEvent.find({ status: { $ne: 'dismissed' } })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Citizen submit new incident report with media
router.post('/reports', async (req, res) => {
  try {
    const { title, text, category, severity, locationName, lat, lng, peopleAffected, citizenName, citizenPhone, mediaUrl } = req.body;

    const rawPost = await RawPost.create({
      source: 'CITIZEN_PORTAL',
      sourceId: `CITIZEN-${Date.now()}`,
      title: title || 'Citizen Distress Report',
      text: text || 'Emergency report filed by public citizen via Citizen Safety Portal.',
      rawTimestamp: new Date(),
      processed: true
    });

    const classified = await ClassifiedEvent.create({
      rawPostId: rawPost._id,
      sourceType: 'CITIZEN_REPORT',
      text: text || 'Public SOS report submitted.',
      url: mediaUrl || 'https://disaster.gov.in/citizen-reports',
      category: category || 'flood',
      location: { type: 'Point', coordinates: [parseFloat(lng) || 77.2090, parseFloat(lat) || 28.6139] },
      locationName: locationName || 'New Delhi, Delhi NCR',
      severity: severity || 'high',
      peopleAffected: parseInt(peopleAffected) || 12,
      confidenceScore: 88,
      status: 'pending'
    });

    let priorityLevel = severity === 'critical' ? 'emergency' : severity === 'high' ? 'urgent' : 'routine';
    const recommendation = await Recommendation.create({
      eventId: classified._id,
      suggestedDepartment: 'NDRF',
      priorityLevel,
      suggestedResources: ['Local SDRF Team', '108 Ambulance Unit', 'First Responder Hotline']
    });

    // Broadcast over Socket.io
    try {
      const ioInstance = req.app.get('socketio');
      if (ioInstance) {
        ioInstance.emit('event:new', { event: classified, recommendation });
      }
    } catch (e) {
      console.log('Socket emit warning:', e.message);
    }

    res.json({ success: true, data: { event: classified, recommendation } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch citizen's submitted reports
router.get('/my-reports', async (req, res) => {
  try {
    const reports = await ClassifiedEvent.find({ sourceType: 'CITIZEN_REPORT' })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
