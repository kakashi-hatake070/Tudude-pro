import mongoose from 'mongoose';

const governmentOfficerSchema = new mongoose.Schema({
  officialId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['super_admin', 'municipal_officer', 'department_officer']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward'
  },
  jurisdictionName: {
    type: String,
    default: 'Central Municipal Zone'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('GovernmentOfficer', governmentOfficerSchema);
