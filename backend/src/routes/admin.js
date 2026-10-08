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

const bcrypt = require('bcryptjs');

// Seed initial audit logs if empty
async function seedInitialAuditLogs() {
  const count = await AuditLog.countDocuments();
  if (count === 0) {
    await AuditLog.create([
      { adminUser: 'Super Admin', action: 'SYSTEM_BOOT', category: 'SECURITY', details: 'Nexus Command System initialized with Level 5 Root Privileges.', ipAddress: '127.0.0.1' },
      { adminUser: 'Super Admin', action: 'FEED_ENABLED', category: 'INGESTION', details: 'Twitter X & Disaster Ingestion Streams initialized.', ipAddress: '127.0.0.1' }
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
      AuditLog.find().sort({ createdAt: -1 }).limit(10)
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

// Get All Real Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create User (Admin Only)
router.post('/users', async (req, res) => {
  try {
    const { name, email, phone, agency, accountType, operationalRole, clearanceLevel, status, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists.' });
    }

    const type = accountType || 'Operator';
    let role = operationalRole;
    if (type === 'Admin') role = 'System Administrator';
    else if (type === 'Citizen') role = 'Citizen';
    else if (!role) role = 'Dispatcher';

    const plainPassword = password || 'Nexus@2026';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminName = req.headers['x-admin-name'] || 'Super Admin';

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      agency: agency || (type === 'Citizen' ? 'Public Citizen' : 'NDRF Central'),
      accountType: type,
      operationalRole: role,
      clearanceLevel: Number(clearanceLevel) || 1,
      status: status || 'Active',
      password: hashedPassword,
      isRootAdmin: false, // Normal Admin cannot create ROOT/SUPER ADMIN
      createdBy: adminName,
      securityToken: `SEC-${Math.floor(1000 + Math.random() * 9000)}-NX`
    });

    // Create Audit Log
    await AuditLog.create({
      adminUser: adminName,
      targetUser: `${newUser.name} (${newUser.email})`,
      action: 'USER_CREATED',
      category: 'USER_MGMT',
      newValue: `${type} / ${role} / Level ${newUser.clearanceLevel}`,
      details: `Created new user ${newUser.name} (${newUser.email}) with role ${role} and Clearance Level ${newUser.clearanceLevel}.`
    });

    res.json({ success: true, data: newUser });
  } catch (error) {
    console.error('[Admin User Create Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update User (Edit, Change Role, Clearance, Status)
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const adminName = req.headers['x-admin-name'] || 'Super Admin';
    const isCallerRoot = req.headers['x-is-root'] === 'true';

    // Prevent non-root admin from modifying Root Admin account
    if (targetUser.isRootAdmin && !isCallerRoot && adminName !== 'Super Admin') {
      return res.status(403).json({ success: false, error: 'Only the Root Super Admin can modify Root Admin accounts.' });
    }

    const { name, email, phone, agency, accountType, operationalRole, clearanceLevel, status, password } = req.body;

    const prevAccountType = targetUser.accountType;
    const prevRole = targetUser.operationalRole;
    const prevClearance = targetUser.clearanceLevel;
    const prevStatus = targetUser.status;

    if (name) targetUser.name = name.trim();
    if (email) targetUser.email = email.toLowerCase().trim();
    if (phone !== undefined) targetUser.phone = phone;
    if (agency) targetUser.agency = agency;
    if (clearanceLevel !== undefined) targetUser.clearanceLevel = Number(clearanceLevel);
    if (status) targetUser.status = status;

    if (accountType) {
      targetUser.accountType = accountType;
      if (accountType === 'Admin') targetUser.operationalRole = 'System Administrator';
      else if (accountType === 'Citizen') targetUser.operationalRole = 'Citizen';
      else if (operationalRole) targetUser.operationalRole = operationalRole;
    } else if (operationalRole) {
      targetUser.operationalRole = operationalRole;
    }

    if (password) {
      targetUser.password = await bcrypt.hash(password, 10);
    }

    await targetUser.save();

    // Create Detailed Audit Logs based on changes
    if (prevStatus !== targetUser.status) {
      await AuditLog.create({
        adminUser: adminName,
        targetUser: `${targetUser.name} (${targetUser.email})`,
        action: targetUser.status === 'Suspended' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
        category: 'USER_MGMT',
        previousValue: prevStatus,
        newValue: targetUser.status,
        details: `Account status for ${targetUser.name} changed from ${prevStatus} to ${targetUser.status}.`
      });
    }

    if (prevRole !== targetUser.operationalRole || prevAccountType !== targetUser.accountType) {
      await AuditLog.create({
        adminUser: adminName,
        targetUser: `${targetUser.name} (${targetUser.email})`,
        action: 'ROLE_CHANGED',
        category: 'USER_MGMT',
        previousValue: `${prevAccountType} - ${prevRole}`,
        newValue: `${targetUser.accountType} - ${targetUser.operationalRole}`,
        details: `Role for ${targetUser.name} changed from ${prevRole} to ${targetUser.operationalRole}.`
      });
    }

    if (prevClearance !== targetUser.clearanceLevel) {
      await AuditLog.create({
        adminUser: adminName,
        targetUser: `${targetUser.name} (${targetUser.email})`,
        action: 'CLEARANCE_CHANGED',
        category: 'USER_MGMT',
        previousValue: `Level ${prevClearance}`,
        newValue: `Level ${targetUser.clearanceLevel}`,
        details: `Clearance level for ${targetUser.name} changed from Level ${prevClearance} to Level ${targetUser.clearanceLevel}.`
      });
    }

    // General update audit log if no single specialized audit triggered
    if (prevStatus === targetUser.status && prevRole === targetUser.operationalRole && prevClearance === targetUser.clearanceLevel) {
      await AuditLog.create({
        adminUser: adminName,
        targetUser: `${targetUser.name} (${targetUser.email})`,
        action: 'USER_UPDATED',
        category: 'USER_MGMT',
        previousValue: `Profile info`,
        newValue: `Updated details`,
        details: `Updated user details for ${targetUser.name} (${targetUser.email}).`
      });
    }

    res.json({ success: true, data: targetUser });
  } catch (error) {
    console.error('[Admin User Update Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete User (With Audit Record)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (targetUser.isRootAdmin) {
      return res.status(403).json({ success: false, error: 'Root Super Admin account cannot be deleted.' });
    }

    const adminName = req.headers['x-admin-name'] || 'Super Admin';

    await User.findByIdAndDelete(userId);

    await AuditLog.create({
      adminUser: adminName,
      targetUser: `${targetUser.name} (${targetUser.email})`,
      action: 'USER_DELETED',
      category: 'USER_MGMT',
      previousValue: `${targetUser.accountType} / ${targetUser.operationalRole} / Level ${targetUser.clearanceLevel}`,
      newValue: 'REMOVED',
      details: `Revoked and deleted user account for ${targetUser.name} (${targetUser.email}).`
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[Admin User Delete Error]:', error);
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
