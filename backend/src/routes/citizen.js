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
    const { title, text, category, severity, locationName, lat, lng, peopleAffected, citizenName, citizenPhone, mediaUrl, mediaEvidence } = req.body;

    const rawPost = await RawPost.create({
      source: 'CITIZEN_PORTAL',
      sourceId: `CITIZEN-${Date.now()}`,
      title: title || 'Citizen Distress Report',
      text: text || 'Emergency report filed by public citizen via Citizen Safety Portal.',
      rawTimestamp: new Date(),
      processed: true
    });

    let priorityLevel = severity === 'critical' ? 'emergency' : severity === 'high' ? 'urgent' : 'routine';

    // Sanitize mediaEvidence & mediaUrl - NEVER store blob: URLs in database!
    let mediaEvidenceClean = [];
    if (Array.isArray(mediaEvidence)) {
      mediaEvidenceClean = mediaEvidence.filter(m => m && m.url && !m.url.startsWith('blob:'));
    } else if (mediaEvidence && typeof mediaEvidence === 'object' && mediaEvidence.url && !mediaEvidence.url.startsWith('blob:')) {
      mediaEvidenceClean.push(mediaEvidence);
    }

    let safeMediaUrl = (mediaUrl && !mediaUrl.startsWith('blob:')) ? mediaUrl : '';
    if (!safeMediaUrl && mediaEvidenceClean.length > 0) {
      safeMediaUrl = mediaEvidenceClean[0].url;
    }

    if (mediaEvidenceClean.length === 0 && safeMediaUrl) {
      const isVideo = safeMediaUrl.endsWith('.mp4') || safeMediaUrl.endsWith('.webm');
      mediaEvidenceClean.push({
        mediaId: `med_${Date.now()}`,
        url: safeMediaUrl,
        type: isVideo ? 'video' : 'image',
        originalName: safeMediaUrl.split('/').pop() || 'media_attachment',
        uploadedAt: new Date()
      });
    }

    const classified = await ClassifiedEvent.create({
      rawPostId: rawPost._id,
      sourceType: 'CITIZEN',
      title: title || 'Citizen Emergency SOS',
      text: text || 'Public SOS report submitted.',
      url: safeMediaUrl || 'https://disaster.gov.in/citizen-reports',
      mediaUrl: safeMediaUrl || '',
      mediaEvidence: mediaEvidenceClean,
      category: category || 'flood',
      location: { type: 'Point', coordinates: [parseFloat(lng) || 77.2090, parseFloat(lat) || 28.6139] },
      locationName: locationName || 'New Delhi, Delhi NCR',
      severity: severity || 'high',
      priorityLevel,
      peopleAffected: parseInt(peopleAffected) || 12,
      confidenceScore: 92,
      status: 'pending',
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhone: citizenPhone || '+91 98765 43210',
      isSimulated: false
    });

    const recommendation = await Recommendation.create({
      eventId: classified._id,
      suggestedDepartment: 'NDRF',
      priorityLevel,
      suggestedResources: ['Local SDRF Team', '108 Ambulance Unit', 'First Responder Hotline']
    });

    // Broadcast live over Socket.io to Operator Portal
    try {
      const ioInstance = req.app.get('socketio');
      if (ioInstance) {
        ioInstance.emit('event:new', { event: classified, recommendation, isCitizen: true });
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
    const reports = await ClassifiedEvent.find({ sourceType: { $in: ['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL'] } })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
