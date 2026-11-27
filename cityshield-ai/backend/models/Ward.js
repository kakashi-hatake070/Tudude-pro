import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Bengaluru'
  },
  boundary: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: Array,
      required: true
    }
  },
  officerInCharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GovernmentOfficer'
  },
  statistics: {
    totalReports: { type: Number, default: 0 },
    pendingReports: { type: Number, default: 0 },
    resolvedReports: { type: Number, default: 0 },
    riskIndex: { type: Number, default: 25 } // 0 - 100
  }
}, {
  timestamps: true
});

wardSchema.index({ boundary: '2dsphere' });

export default mongoose.model('Ward', wardSchema);
