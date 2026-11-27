import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cityshield-super-secure-jwt-secret-2026';

// Generate random anonymous citizen pseudonym e.g. CityGuardian_4821
function generateAnonymousId() {
  const prefixes = [
    'CityGuardian',
    'UrbanWatcher',
    'RoadObserver',
    'CivicSentinel',
    'MetroShield',
    'StreetMonitor',
    'SafeCity scout'
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)].replace(' ', '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}_${randomNum}`;
}

export const registerCitizen = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Generate guaranteed unique anonymous ID
    let anonymousId = generateAnonymousId();
    while (await User.findOne({ anonymousId })) {
      anonymousId = generateAnonymousId();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      anonymousId,
      email: email || undefined,
      password: hashedPassword,
      citizenPoints: 25,
      badges: ['Civic Explorer']
    });

    const token = jwt.sign({ id: user._id, anonymousId: user.anonymousId, role: 'citizen' }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      message: 'Citizen account registered with anonymous identity.',
      token,
      user: {
        id: user._id,
        anonymousId: user.anonymousId,
        citizenPoints: user.citizenPoints,
        badges: user.badges,
        savedPlaces: user.savedPlaces,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

export const loginCitizen = async (req, res) => {
  try {
    const { anonymousId, password } = req.body;

    if (!anonymousId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Anonymous ID and password.' });
    }

    const user = await User.findOne({ anonymousId });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Anonymous ID or credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Anonymous ID or credentials.' });
    }

    const token = jwt.sign({ id: user._id, anonymousId: user.anonymousId, role: 'citizen' }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        anonymousId: user.anonymousId,
        citizenPoints: user.citizenPoints,
        badges: user.badges,
        savedPlaces: user.savedPlaces,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      anonymousId: req.user.anonymousId,
      citizenPoints: req.user.citizenPoints,
      badges: req.user.badges,
      savedPlaces: req.user.savedPlaces,
      notificationPreferences: req.user.notificationPreferences,
      createdAt: req.user.createdAt
    }
  });
};

export const updateSavedPlaces = async (req, res) => {
  try {
    const { savedPlaces } = req.body;
    req.user.savedPlaces = savedPlaces;
    await req.user.save();
    res.json({ success: true, savedPlaces: req.user.savedPlaces });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
