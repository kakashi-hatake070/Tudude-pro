import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import GovernmentOfficer from '../models/GovernmentOfficer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cityshield-super-secure-jwt-secret-2026';

// Protect routes for citizens
export const protectCitizen = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Citizen account not found or deactivated.' });
    }
    req.user = user;
    req.userType = 'citizen';
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

// Protect routes for government personnel
export const protectGovernment = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Official government credentials required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const officer = await GovernmentOfficer.findById(decoded.id)
      .populate('department')
      .populate('ward')
      .select('-password');

    if (!officer || !officer.active) {
      return res.status(401).json({ success: false, message: 'Authorized officer record not found or inactive.' });
    }

    req.officer = officer;
    req.userType = 'government';
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired government session.' });
  }
};

// Role-based access control for government officials
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.officer || !roles.includes(req.officer.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}] roles. Your role is ${req.officer?.role || 'unassigned'}.`
      });
    }
    next();
  };
};

// Optional auth (extracts user if present, but doesn't block guests)
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token decode failure on optional route
    }
  }
  next();
};
