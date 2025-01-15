import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Aktualisiere updatedAt vor jedem Speichern
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema); 