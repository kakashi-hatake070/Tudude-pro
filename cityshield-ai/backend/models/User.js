import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'citizen',
    enum: ['citizen']
  },
  citizenPoints: {
    type: Number,
    default: 25 // Welcome bonus
  },
  badges: [{
    type: String
  }],
  savedPlaces: [{
    name: String,
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  }],
  notificationPreferences: {
    nearbyAlerts: { type: Boolean, default: true },
    weatherWarnings: { type: Boolean, default: true },
    reportUpdates: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
