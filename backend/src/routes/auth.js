const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// Ensure default ROOT ADMIN exists in MongoDB
async function seedDefaultRootAdmin() {
  const rootEmail = 'admin@nexuscommand.org';
  const existingRoot = await User.findOne({ email: rootEmail });
  
  if (!existingRoot) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Super Admin',
      email: rootEmail,
      phone: '+91 9876543210',
      agency: 'NDRF Central HQ',
      accountType: 'Admin',
      operationalRole: 'System Administrator',
      clearanceLevel: 5,
      status: 'Active',
      password: hashedPassword,
      isRootAdmin: true,
      createdBy: 'SYSTEM_BOOT',
      securityToken: 'SEC-9901-NX'
    });

    await AuditLog.create({
      adminUser: 'SYSTEM_BOOT',
      targetUser: 'Super Admin (admin@nexuscommand.org)',
      action: 'USER_CREATED',
      category: 'SECURITY',
      newValue: 'Admin / System Administrator / Level 5',
      details: 'Initial Root Super Admin account created on system boot.'
    });
    console.log('[Auth] Default Root Admin ensured (admin@nexuscommand.org / admin123)');
  }
}


// 1. PUBLIC REGISTRATION (For Citizens or new Operators)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, agency, password, accountType, operationalRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Public registration defaults to Citizen with Level 1 clearance
    const isAdminCreated = Boolean(req.headers['x-admin-name']);
    const targetAccountType = isAdminCreated ? (accountType || 'Citizen') : 'Citizen';
    let role = targetAccountType === 'Citizen' ? 'Citizen' : (operationalRole || 'Dispatcher');

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      agency: agency || (targetAccountType === 'Citizen' ? 'Public Citizen' : 'NDRF Regional'),
      accountType: targetAccountType,
      operationalRole: role,
      clearanceLevel: targetAccountType === 'Citizen' ? 1 : 2,
      status: 'Active',
      password: hashedPassword,
      isRootAdmin: false,
      createdBy: 'Self Registration',
      securityToken: `SEC-${Math.floor(1000 + Math.random() * 9000)}-NX`
    });


    await AuditLog.create({
      adminUser: newUser.name,
      targetUser: `${newUser.name} (${newUser.email})`,
      action: 'USER_CREATED',
      category: 'USER_MGMT',
      newValue: `${newUser.accountType} / ${newUser.operationalRole} / Level ${newUser.clearanceLevel}`,
      details: `New ${newUser.accountType} account registered via Portal.`
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, accountType: newUser.accountType, clearanceLevel: newUser.clearanceLevel },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: newUser
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. UNIFIED LOGIN (Checks MongoDB User Record)
router.post('/login', async (req, res) => {
  try {
    await seedDefaultRootAdmin();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const inputEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: inputEmail });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication Failed: Invalid Email or Password.' });
    }

    // Check if account is suspended FIRST
    if (user.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Contact the administrator.'
      });
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Authentication Failed: Invalid Email or Password.' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        operationalRole: user.operationalRole,
        clearanceLevel: user.clearanceLevel,
        isRootAdmin: user.isRootAdmin
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        agency: user.agency,
        accountType: user.accountType,
        operationalRole: user.operationalRole,
        clearanceLevel: user.clearanceLevel,
        status: user.status,
        isRootAdmin: user.isRootAdmin,
        securityToken: user.securityToken,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        createdBy: user.createdBy
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET CURRENT USER PROFILE
router.get('/me', verifyToken, async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = { router, seedDefaultRootAdmin };
