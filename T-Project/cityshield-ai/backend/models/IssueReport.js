import mongoose from 'mongoose';

const issueReportSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  reporterAnonymousId: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'waterlogging',
      'potholes',
      'garbage',
      'damaged_roads',
      'streetlights',
      'drainage',
      'public_infrastructure',
      'accidents',
      'other'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  approximateLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number] // fuzzed for privacy (approx ±75m)
    }
  },
  address: {
    type: String,
    required: true
  },
  wardNumber: {
    type: Number,
    index: true
  },
  media: [{
    url: String,
    thumbnail: String,
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    cleanHash: String
  }],
  status: {
    type: String,
    default: 'submitted',
    enum: [
      'submitted',
      'under_review',
      'verified',
      'assigned',
      'in_progress',
      'resolved',
      'rejected',
      'reopened'
    ],
    index: true
  },
  priority: {
    type: String,
    default: 'medium',
    enum: ['low', 'medium', 'high', 'critical'],
    index: true
  },
  riskScore: {
    type: Number,
    default: 30, // 0 to 100
    index: true
  },
  aiAnalysis: {
    category: String,
    confidence: Number,
    detectedObjects: [{
      label: String,
      confidence: Number,
      box: [Number] // [ymin, xmin, ymax, xmax]
    }],
    severity: {
      level: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      score: Number,
      depthEstimateCm: Number
    },
    duplicateOfTrackingId: { type: String, default: null },
    processedAt: Date
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: String // anonymousId
  }],
  verifications: [{
    verifiedBy: String, // anonymousId
    status: { type: String, enum: ['confirmed', 'disputed', 'cleared'] },
    comments: String,
    timestamp: { type: Date, default: Date.now }
  }],
  assignedDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GovernmentOfficer'
  },
  resolutionProof: {
    mediaUrls: [String],
    remarks: String,
    resolvedAt: Date,
    resolvedBy: String
  },
  auditTrail: [{
    action: String,
    changedBy: String,
    previousStatus: String,
    newStatus: String,
    remarks: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

issueReportSchema.index({ location: '2dsphere' });
issueReportSchema.index({ approximateLocation: '2dsphere' });
issueReportSchema.index({ createdAt: -1 });

export default mongoose.model('IssueReport', issueReportSchema);
