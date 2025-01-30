import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lockPeriodDays: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Methode zur Verfügbarkeitsprüfung
productSchema.methods.checkAvailability = async function(startDate, endDate, requestedQuantity = 1) {
  console.log('Checking availability for:', {
    productId: this._id,
    productName: this.name,
    startDate,
    endDate,
    requestedQuantity,
    totalQuantity: this.quantity
  });

  // Berücksichtige Sperrzeitraum
  const extendedEndDate = new Date(endDate);
  extendedEndDate.setDate(extendedEndDate.getDate() + (this.lockPeriodDays || 0));
  
  console.log('Extended end date with lock period:', extendedEndDate);

  // Finde überlappende Buchungen
  const overlappingBookings = await mongoose.model('Booking').find({
    'items.product': this._id,
    'items.startDate': { $lte: extendedEndDate },
    'items.endDate': { $gte: startDate },
    status: { $nin: ['cancelled', 'completed'] }
  });

  console.log('Found overlapping bookings:', overlappingBookings);

  // Berechne gebuchte Menge im Zeitraum
  let bookedQuantity = 0;
  overlappingBookings.forEach(booking => {
    booking.items.forEach(item => {
      if (item.product.equals(this._id)) {
        console.log(`Adding ${item.quantity} from booking ${booking._id}`);
        bookedQuantity += item.quantity;
      }
    });
  });

  const remainingQuantity = this.quantity - bookedQuantity;
  const isAvailable = remainingQuantity >= requestedQuantity && this.isActive;

  console.log('Availability result:', {
    bookedQuantity,
    remainingQuantity,
    isAvailable
  });

  return {
    isAvailable,
    totalQuantity: this.quantity,
    bookedQuantity,
    remainingQuantity,
    requestedQuantity
  };
};

const Product = mongoose.model('Product', productSchema);

export default Product; 