import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  slaHours: {
    type: Number,
    default: 48
  },
  categoriesHandled: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Department', departmentSchema);
