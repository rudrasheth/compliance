import mongoose from 'mongoose';

const complianceMetricSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalFilings: {
    type: Number,
    default: 0
  },
  onTimeFilings: {
    type: Number,
    default: 0
  },
  lateFilings: {
    type: Number,
    default: 0
  },
  pendingFilings: {
    type: Number,
    default: 0
  },
  details: {
    gstCompliance: Number,
    incomeTaxCompliance: Number,
    professionalTaxCompliance: Number,
    licenseCompliance: Number
  }
}, {
  timestamps: true
});

// Compound index for unique month-year combinations
complianceMetricSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model('ComplianceMetric', complianceMetricSchema);