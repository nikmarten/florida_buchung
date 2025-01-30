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
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    returnStatus: {
      type: String,
      enum: ['pending', 'returned', 'damaged', 'lost'],
      default: 'pending'
    },
    returnDate: {
      type: Date
    },
    notes: String
  }],
  notes: String
}, {
  timestamps: true
});

// Validate endDate is after startDate
bookingSchema.pre('save', function(next) {
  for (const item of this.items) {
    if (item.endDate <= item.startDate) {
      next(new Error('End date must be after start date'));
      return;
    }
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; 