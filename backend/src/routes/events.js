const express = require('express');
const router = express.Router();
const ClassifiedEvent = require('../models/ClassifiedEvent');
const Recommendation = require('../models/Recommendation');

// GET /api/events - Get events with optional query parameters
router.get('/', async (req, res) => {
  try {
    const { sourceType, category, severity, status, search, module: moduleParam } = req.query;
    let query = {};

    if (moduleParam === 'citizen') {
      query.sourceType = { $in: ['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'] };
    } else if (moduleParam === 'external') {
      query.sourceType = { $nin: ['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'] };
    } else if (sourceType) {
      if (sourceType === 'CITIZEN') {
        query.sourceType = { $in: ['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'] };
      } else {
        query.sourceType = sourceType;
      }
    }

    if (category && category !== 'all') query.category = category;
    if (severity && severity !== 'all') query.severity = severity;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { locationName: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await ClassifiedEvent.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
      
    const eventIds = events.map(e => e._id);
    const recommendations = await Recommendation.find({ eventId: { $in: eventIds } });
    
    const eventsFormatted = events.map(e => {
      const obj = e.toObject();
      if (['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'].includes(obj.sourceType)) {
        obj.source = 'CITIZEN';
      } else {
        obj.source = obj.sourceType;
      }
      return obj;
    });

    res.json({ success: true, data: { events: eventsFormatted, recommendations } });
  } catch (error) {
    console.error('[API Events] Error fetching events:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/events/:id - Get single incident details
router.get('/:id', async (req, res) => {
  try {
    const event = await ClassifiedEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Incident not found' });
    const recommendation = await Recommendation.findOne({ eventId: event._id });
    
    const eventObj = event.toObject();
    if (['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'].includes(eventObj.sourceType)) {
      eventObj.source = 'CITIZEN';
    } else {
      eventObj.source = eventObj.sourceType;
    }

    res.json({ success: true, data: { event: eventObj, recommendation } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/events/:id - Update incident details (status, priority, assigned team, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { status, priorityLevel, assignedTeam, note, severity } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (priorityLevel) updateData.priorityLevel = priorityLevel;
    if (assignedTeam !== undefined) updateData.assignedTeam = assignedTeam;
    if (severity) updateData.severity = severity;

    const event = await ClassifiedEvent.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    
    if (note && note.trim()) {
      event.operatorNotes.push({
        text: note.trim(),
        createdAt: new Date(),
        author: req.body.author || 'Operator Dispatcher'
      });
      await event.save();
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const handleApproveEvent = async (req, res) => {
  try {
    const operatorName = req.body.operatorName || req.body.author || 'Operator Dispatcher';
    const operatorNotes = req.body.operatorNotes || req.body.note || 'Verified against telemetry source.';
    
    const event = await ClassifiedEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Incident not found' });

    event.status = 'approved';
    event.approvedBy = operatorName;
    event.approvedAt = new Date();
    
    if (operatorNotes && operatorNotes.trim()) {
      event.operatorNotes.push({
        text: `Approved by ${operatorName}. ${operatorNotes.trim()}`,
        createdAt: new Date(),
        author: operatorName
      });
    }

    await event.save();

    const eventObj = event.toObject();
    if (['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'].includes(eventObj.sourceType)) {
      eventObj.source = 'CITIZEN';
    } else {
      eventObj.source = eventObj.sourceType;
    }

    res.json({ success: true, data: eventObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const handleRejectEvent = async (req, res) => {
  try {
    const reason = req.body.reason || req.body.rejectionReason;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, error: 'Rejection reason is required' });
    }

    const opName = req.body.operatorName || req.body.author || 'Operator Dispatcher';
    const operatorNotes = req.body.operatorNotes || req.body.note || '';

    const event = await ClassifiedEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Incident not found' });

    event.status = 'rejected';
    event.rejectedBy = opName;
    event.rejectedAt = new Date();
    event.rejectionReason = reason.trim();

    const noteText = operatorNotes && operatorNotes.trim() 
      ? `REJECTED by ${opName}. Reason: ${reason.trim()}. Note: ${operatorNotes.trim()}`
      : `REJECTED by ${opName}. Reason: ${reason.trim()}`;

    event.operatorNotes.push({
      text: noteText,
      createdAt: new Date(),
      author: opName
    });

    await event.save();

    const eventObj = event.toObject();
    if (['CITIZEN', 'CITIZEN_REPORT', 'CITIZEN_PORTAL', 'CITIZEN_SOS'].includes(eventObj.sourceType)) {
      eventObj.source = 'CITIZEN';
    } else {
      eventObj.source = eventObj.sourceType;
    }

    res.json({ success: true, data: eventObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Routes supporting both POST and PATCH
router.post('/:id/approve', handleApproveEvent);
router.patch('/:id/approve', handleApproveEvent);

router.post('/:id/reject', handleRejectEvent);
router.patch('/:id/reject', handleRejectEvent);

// POST /api/events/:id/dismiss - Legacy quick dismiss alias
router.post('/:id/dismiss', async (req, res) => {
  try {
    const event = await ClassifiedEvent.findByIdAndUpdate(
      req.params.id, 
      { $set: { status: 'rejected', rejectionReason: req.body.rejectionReason || 'Dismissed by Operator', rejectedAt: new Date() } }, 
      { new: true }
    );
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/events/:id/assign - Assign response team
router.post('/:id/assign', async (req, res) => {
  try {
    const { assignedTeam, priorityLevel } = req.body;
    const updateData = { status: 'response_assigned' };
    if (assignedTeam) updateData.assignedTeam = assignedTeam;
    if (priorityLevel) updateData.priorityLevel = priorityLevel;

    const event = await ClassifiedEvent.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    
    // Add note
    if (assignedTeam) {
      event.operatorNotes.push({
        text: `Assigned response team: ${assignedTeam}. Priority set to ${priorityLevel || event.priorityLevel}.`,
        createdAt: new Date(),
        author: 'Operator Dispatcher'
      });
      await event.save();
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/events/:id/notes - Add operator note
router.post('/:id/notes', async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'Note text required' });

    const event = await ClassifiedEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Incident not found' });

    event.operatorNotes.push({
      text: text.trim(),
      createdAt: new Date(),
      author: author || 'Operator Dispatcher'
    });
    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
