import mongoose from 'mongoose';

const filingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['GST', 'Income Tax', 'Professional Tax', 'License', 'Other']
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'ready', 'filed', 'verified', 'overdue'],
    default: 'draft'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  filedDate: Date,
  acknowledgmentNumber: String,
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: String
}, {
  timestamps: true
});

// Index for efficient queries
filingSchema.index({ dueDate: 1, status: 1 });
filingSchema.index({ type: 1, status: 1 });

export default mongoose.model('Filing', filingSchema);