import mongoose from 'mongoose';

const weatherObservationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true
  },
  temperature: {
    type: Number,
    required: true
  },
  rainfallMmPerHour: {
    type: Number,
    default: 0
  },
  forecast24hMm: {
    type: Number,
    default: 0
  },
  humidity: {
    type: Number,
    default: 65
  },
  warningLevel: {
    type: String,
    enum: ['green', 'yellow', 'orange', 'red'],
    default: 'green'
  },
  warningTitle: {
    type: String,
    default: 'Normal Weather Conditions'
  },
  warningDescription: {
    type: String,
    default: 'No heavy rainfall or monsoon hazard alerts for the municipal area.'
  },
  source: {
    type: String,
    default: 'IMD Nowcast & Open-Meteo Doppler Feed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('WeatherObservation', weatherObservationSchema);
