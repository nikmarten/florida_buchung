import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  equipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true,
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Booking', bookingSchema); 