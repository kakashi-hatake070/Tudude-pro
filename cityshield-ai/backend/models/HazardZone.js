import mongoose from 'mongoose';

const hazardZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['flood_prone', 'chronic_waterlogging', 'severe_pothole_cluster', 'dark_zone', 'accident_blackspot']
  },
  geometry: {
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
  riskLevel: {
    type: String,
    required: true,
    enum: ['moderate', 'high', 'extreme']
  },
  dataSource: {
    type: String,
    default: 'IMD / Bhuvan Historical Flood Inundation Survey'
  },
  historicalIncidentsCount: {
    type: Number,
    default: 5
  },
  lastActiveRainThresholdMm: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

hazardZoneSchema.index({ geometry: '2dsphere' });

export default mongoose.model('HazardZone', hazardZoneSchema);
