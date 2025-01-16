import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validierung für Start- und Enddatum
bookingSchema.pre('save', function(next) {
  // Überprüfe jedes Item in der Buchung
  for (const item of this.items) {
    // Setze die Uhrzeiten für konsistente Vergleiche
    const startDate = new Date(item.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(item.endDate);
    endDate.setHours(23, 59, 59, 999);

    // Aktualisiere die Daten im Dokument
    item.startDate = startDate;
    item.endDate = endDate;

    // Überprüfe, ob das Enddatum nach dem Startdatum liegt
    if (endDate <= startDate) {
      next(new Error('Das Enddatum muss nach dem Startdatum liegen'));
      return;
    }
  }
  next();
});

export default mongoose.model('Booking', bookingSchema); 