const express = require('express');
const router = express.Router();
const ClassifiedEvent = require('../models/ClassifiedEvent');
const RawPost = require('../models/RawPost');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const AdminConfig = require('../models/AdminConfig');
const AuditLog = require('../models/AuditLog');

// Global in-memory feed toggle state (fallback if DB not seeded)
let feedState = {
  twitterStream: true,
  rssNews: true,
  emergencyHotline: true,
  radarWeather: true
};

// Seed initial users if empty
async function seedInitialUsers() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create([
      { name: 'Dr. Sarah Jenkins', email: 'jenkins.sarah@nexuscommand.gov.in', agency: 'NDRF HQ Delhi', role: 'Admin', clearanceLevel: 5, status: 'Active', securityToken: 'SEC-9901-NX' },
      { name: 'Commander Rajesh Sharma', email: 'r.sharma@ndrf.gov.in', agency: 'NDRF 8th Battalion', role: 'Commander', clearanceLevel: 4, status: 'Active', securityToken: 'SEC-8820-NX' },
      { name: 'Ananya Roy', email: 'ananya.roy@sdrf.kerala.gov.in', agency: 'SDRF Disaster Cell', role: 'Dispatcher', clearanceLevel: 3, status: 'Active', securityToken: 'SEC-7741-NX' },
      { name: 'Vikramaditya Singh', email: 'vikram.singh@indiancoastguard.in', agency: 'Indian Coast Guard West', role: 'Analyst', clearanceLevel: 3, status: 'Active', securityToken: 'SEC-5510-NX' },
      { name: 'Captain Priya Nair', email: 'p.nair@firedept.mh.gov.in', agency: 'Mumbai Fire & Rescue', role: 'Dispatcher', clearanceLevel: 2, status: 'Pending Verification', securityToken: 'SEC-3329-NX' }
    ]);
  }
}

// Seed initial audit logs if empty
async function seedInitialAuditLogs() {
  const count = await AuditLog.countDocuments();
  if (count === 0) {
    await AuditLog.create([
      { adminUser: 'Dr. Sarah Jenkins (Level 5)', action: 'SYSTEM_BOOT', category: 'SECURITY', details: 'Nexus Command System initialized with Level 0 root privileges.', ipAddress: '192.168.1.100' },
      { adminUser: 'Dr. Sarah Jenkins (Level 5)', action: 'FEED_ENABLED', category: 'INGESTION', details: 'Twitter X Real-Time Ingestion Stream enabled.', ipAddress: '192.168.1.100' },
      { adminUser: 'System Autopilot', action: 'AI_THRESHOLD_SET', category: 'AI_ENGINE', details: 'Default NLP Confidence Threshold set to 70%.', ipAddress: '127.0.0.1' },
      { adminUser: 'Commander Rajesh Sharma', action: 'USER_LOGIN', category: 'USER_MGMT', details: 'Commander authenticated via Station Clearance Token.', ipAddress: '10.0.4.15' }
    ]);
  }
}

// Ensure AdminConfig exists
async function getOrCreateConfig() {
  let config = await AdminConfig.findOne();
  if (!config) {
    config = await AdminConfig.create({
      confidenceThreshold: 75,
      duplicateRadiusKm: 15,
      autoDispatchEmergency: false,
      maintenanceMode: false,
      keywordTriggers: ['sos', 'trapped', 'landslide', 'tsunami', 'cloudburst', 'collapse', 'chemical leak', 'dam breach'],
      feeds: feedState
    });
  }
  return config;
}

// ==========================================
// 1. OVERVIEW & TELEMETRY
// ==========================================
router.get('/overview', async (req, res) => {
  try {
    await seedInitialUsers();
    await seedInitialAuditLogs();

    const [
      totalEvents,
      pendingEvents,
      approvedEvents,
      dismissedEvents,
      totalRawPosts,
      totalUsers,
      config,
      recentAuditLogs
    ] = await Promise.all([
      ClassifiedEvent.countDocuments(),
      ClassifiedEvent.countDocuments({ status: 'pending' }),
      ClassifiedEvent.countDocuments({ status: 'approved' }),
      ClassifiedEvent.countDocuments({ status: 'dismissed' }),
      RawPost.countDocuments(),
      User.countDocuments(),
      getOrCreateConfig(),
      AuditLog.find().sort({ createdAt: -1 }).limit(6)
    ]);

    const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

    res.json({
      success: true,
      data: {
        totalEvents,
        pendingEvents,
        approvedEvents,
        dismissedEvents,
        totalRawPosts,
        totalUsers,
        config,
        feeds: config.feeds || feedState,
        recentAuditLogs,
        systemHealth: {
          status: 'HEALTHY',
          uptimeSeconds: Math.floor(process.uptime()),
          memoryUsageMB: memUsage,
          databaseStatus: 'CONNECTED (MongoDB Local)',
          aiEngineLatencyMs: 42,
          ingestionRatePerMin: 18,
          activeSocketConnections: 4
        }
      }
    });
  } catch (error) {
    console.error('[Admin API] Error fetching overview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. USER ACCESS MANAGEMENT (RBAC)
// ==========================================
router.get('/users', async (req, res) => {
  try {
    await seedInitialUsers();
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, agency, role, clearanceLevel, status } = req.body;
    const newUser = await User.create({
      name,
      email,
      agency: agency || 'NDRF Central',
      role: role || 'Dispatcher',
      clearanceLevel: clearanceLevel || 3,
      status: status || 'Active',
      securityToken: `SEC-${Math.floor(1000 + Math.random() * 9000)}-NX`
    });

    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'USER_CREATED',
      category: 'USER_MGMT',
      details: `Created user account for ${name} (${email}) - Role: ${role}, Agency: ${agency}.`
    });

    res.json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'USER_UPDATED',
      category: 'USER_MGMT',
      details: `Updated clearance & profile for user ${updatedUser.name} (${updatedUser.email}).`
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (deletedUser) {
      await AuditLog.create({
        adminUser: 'Super Admin (Level 0)',
        action: 'USER_DELETED',
        category: 'USER_MGMT',
        details: `Revoked and deleted access for user ${deletedUser.name} (${deletedUser.email}).`
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. INGESTION PIPELINE & TEST INJECTION
// ==========================================
router.get('/ingestion', async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({ success: true, data: { feeds: config.feeds || feedState } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ingestion/toggle', async (req, res) => {
  try {
    const { feedKey, enabled } = req.body;
    const config = await getOrCreateConfig();
    
    config.feeds[feedKey] = enabled;
    await config.save();
    feedState[feedKey] = enabled;

    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'FEED_TOGGLED',
      category: 'INGESTION',
      details: `Ingestion stream '${feedKey}' set to ${enabled ? 'ENABLED' : 'PAUSED'}.`
    });

    res.json({ success: true, data: config.feeds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manual Custom Incident Injection
router.post('/ingestion/inject', async (req, res) => {
  try {
    const { title, text, category, severity, locationName, lat, lng, agency, peopleAffected } = req.body;
    
    // Create RawPost
    const rawPost = await RawPost.create({
      source: 'ADMIN_INJECTION',
      sourceId: `ADMIN-SIM-${Date.now()}`,
      title: title || 'Admin Simulated Emergency Incident',
      text: text || 'Emergency incident injected via Admin Portal for operational stress testing.',
      rawTimestamp: new Date(),
      processed: true
    });

    // Create ClassifiedEvent
    const classified = await ClassifiedEvent.create({
      rawPostId: rawPost._id,
      sourceType: 'ADMIN_MANUAL_DISPATCH',
      text: text || 'Simulated Emergency Incident injected by Administrator.',
      url: 'https://ndma.gov.in/admin-dispatch',
      category: category || 'flood',
      location: { type: 'Point', coordinates: [parseFloat(lng) || 77.2090, parseFloat(lat) || 28.6139] },
      locationName: locationName || 'New Delhi, Delhi NCR',
      severity: severity || 'critical',
      peopleAffected: parseInt(peopleAffected) || 450,
      confidenceScore: 99,
      status: 'approved'
    });

    // Create Recommendation
    let priorityLevel = 'routine';
    if (severity === 'high') priorityLevel = 'urgent';
    if (severity === 'critical') priorityLevel = 'emergency';

    const recommendation = await Recommendation.create({
      eventId: classified._id,
      suggestedDepartment: agency || 'NDRF',
      priorityLevel,
      suggestedResources: ['2x Immediate Tactical Teams', '3x Rescue Boats', 'Heavy Drainage Pumps', '108 Ambulance Unit']
    });

    // Broadcast live over Socket.io if available
    try {
      const ioInstance = req.app.get('socketio');
      if (ioInstance) {
        ioInstance.emit('event:new', { event: classified, recommendation });
      }
    } catch (e) {
      console.log('Socket emit warning:', e.message);
    }

    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'INCIDENT_INJECTED',
      category: 'INGESTION',
      details: `Manually injected simulated ${severity.toUpperCase()} level ${category.toUpperCase()} event at ${locationName}.`
    });

    res.json({ success: true, data: { classified, recommendation } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 4. AI TRIAGE & CONFIG
// ==========================================
router.get('/ai-config', async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ai-config', async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    
    if (req.body.confidenceThreshold !== undefined) config.confidenceThreshold = req.body.confidenceThreshold;
    if (req.body.duplicateRadiusKm !== undefined) config.duplicateRadiusKm = req.body.duplicateRadiusKm;
    if (req.body.autoDispatchEmergency !== undefined) config.autoDispatchEmergency = req.body.autoDispatchEmergency;
    if (req.body.keywordTriggers) config.keywordTriggers = req.body.keywordTriggers;
    
    await config.save();

    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'AI_CONFIG_UPDATED',
      category: 'AI_ENGINE',
      details: `AI Triage config updated. Confidence cutoff: ${config.confidenceThreshold}%, Radius: ${config.duplicateRadiusKm}km.`
    });

    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 5. MASTER INCIDENT OVERRIDE
// ==========================================
router.get('/incidents', async (req, res) => {
  try {
    const { status, category, severity, search } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (severity && severity !== 'all') query.severity = severity;
    if (search) {
      query.$or = [
        { locationName: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await ClassifiedEvent.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/incidents/:id', async (req, res) => {
  try {
    const updated = await ClassifiedEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'INCIDENT_MODIFIED',
      category: 'INCIDENT_OVERRIDE',
      details: `Admin modified incident ID ${req.params.id} (Location: ${updated.locationName}, Status: ${updated.status}).`
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/incidents/:id', async (req, res) => {
  try {
    const deleted = await ClassifiedEvent.findByIdAndDelete(req.params.id);
    
    if (deleted) {
      await AuditLog.create({
        adminUser: 'Super Admin (Level 0)',
        action: 'INCIDENT_DELETED',
        category: 'INCIDENT_OVERRIDE',
        details: `Admin permanently purged incident record ID ${req.params.id} (${deleted.locationName}).`
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/incidents/bulk', async (req, res) => {
  try {
    const { eventIds, action } = req.body; // action: 'approve', 'dismiss', 'delete'

    if (action === 'approve') {
      await ClassifiedEvent.updateMany({ _id: { $in: eventIds } }, { status: 'approved' });
    } else if (action === 'dismiss') {
      await ClassifiedEvent.updateMany({ _id: { $in: eventIds } }, { status: 'dismissed' });
    } else if (action === 'delete') {
      await ClassifiedEvent.deleteMany({ _id: { $in: eventIds } });
    }

    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'BULK_INCIDENT_OVERRIDE',
      category: 'INCIDENT_OVERRIDE',
      details: `Admin performed bulk '${action.toUpperCase()}' action on ${eventIds.length} incident records.`
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 6. AUDIT & SECURITY LOGS
// ==========================================
router.get('/logs', async (req, res) => {
  try {
    await seedInitialAuditLogs();
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(150);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/logs/clear', async (req, res) => {
  try {
    await AuditLog.deleteMany({ category: { $ne: 'SECURITY' } });
    
    await AuditLog.create({
      adminUser: 'Super Admin (Level 0)',
      action: 'AUDIT_LOGS_PRUGED',
      category: 'SECURITY',
      details: 'Historical non-security audit logs cleared by administrator.'
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
