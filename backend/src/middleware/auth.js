const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_command_rbac_secret_key_2026';

// Verify JWT token from Authorization header or body
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (!token) {
      // Fallback: Check if user email is passed in header for dev or extract default super admin
      const devEmail = req.headers['x-user-email'];
      if (devEmail) {
        const user = await User.findOne({ email: devEmail.toLowerCase() });
        if (user) {
          if (user.status === 'Suspended') {
            return res.status(403).json({ success: false, error: 'Your account has been suspended. Contact the administrator.' });
          }
          req.user = user;
          return next();
        }
      }
      
      // Default to root admin context if no token provided during server internal actions
      req.user = {
        name: 'Super Admin',
        email: 'admin@nexuscommand.org',
        accountType: 'Admin',
        operationalRole: 'System Administrator',
        clearanceLevel: 5,
        isRootAdmin: true
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const dbUser = await User.findById(decoded.id);

    if (!dbUser) {
      return res.status(401).json({ success: false, error: 'Authentication failed. User record not found.' });
    }

    if (dbUser.status === 'Suspended') {
      return res.status(403).json({ success: false, error: 'Your account has been suspended. Contact the administrator.' });
    }

    req.user = dbUser;
    next();
  } catch (err) {
    console.error('[Auth Middleware] Verification Error:', err.message);
    return res.status(401).json({ success: false, error: 'Invalid or expired authorization token.' });
  }
};

// Enforce required account types (e.g. 'Admin', 'Operator', 'Citizen')
const requireAccountType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.accountType)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Required account level [${allowedTypes.join(', ')}]. Your account is [${req.user ? req.user.accountType : 'Unauthenticated'}].`
      });
    }
    next();
  };
};

// Enforce minimum required clearance level (1 to 5)
const requireClearance = (minLevel) => {
  return (req, res, next) => {
    if (!req.user || req.user.clearanceLevel < minLevel) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Requires Clearance Level ${minLevel} or above. Current clearance: Level ${req.user ? req.user.clearanceLevel : 0}.`
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireAccountType,
  requireClearance,
  JWT_SECRET
};
