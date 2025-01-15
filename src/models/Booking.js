import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING'
  },
  items: [{
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validiere, dass endDate nach startDate liegt
bookingSchema.pre('save', function(next) {
  this.items.forEach(item => {
    if (item.endDate <= item.startDate) {
      next(new Error('Enddatum muss nach dem Startdatum liegen'));
    }
  });
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema); 