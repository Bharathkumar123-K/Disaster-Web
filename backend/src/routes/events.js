const express = require('express');
const router = express.Router();
const ClassifiedEvent = require('../models/ClassifiedEvent');
const Recommendation = require('../models/Recommendation');
const ioInstance = require('../server'); // we will inject io later or export from server

router.get('/', async (req, res) => {
  try {
    const events = await ClassifiedEvent.find()
      .sort({ createdAt: -1 })
      .limit(50);
      
    // Fetch recommendations for these events
    const eventIds = events.map(e => e._id);
    const recommendations = await Recommendation.find({ eventId: { $in: eventIds } });
    
    res.json({ success: true, data: { events, recommendations } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

router.post('/:id/approve', async (req, res) => {
  try {
    const event = await ClassifiedEvent.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.post('/:id/dismiss', async (req, res) => {
  try {
    const event = await ClassifiedEvent.findByIdAndUpdate(req.params.id, { status: 'dismissed' }, { new: true });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
