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
  }).populate('items.product');

  // Sammle Informationen über die Buchungen
  const bookingInfo = overlappingBookings.map(booking => ({
    customerName: booking.customerName,
    startDate: booking.items.find(i => i.product._id.toString() === this._id.toString())?.startDate,
    endDate: booking.items.find(i => i.product._id.toString() === this._id.toString())?.endDate,
    quantity: booking.items.find(i => i.product._id.toString() === this._id.toString())?.quantity
  })).filter(info => info.quantity);

  // Berechne gebuchte Menge im Zeitraum
  let totalBookedQuantity = 0;
  
  overlappingBookings.forEach(booking => {
    // Überspringe stornierte oder abgeschlossene Buchungen
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      console.log(`Skipping booking ${booking._id} with status ${booking.status}`);
      return;
    }

    booking.items.forEach(item => {
      if (item.product._id.toString() !== this._id.toString()) {
        console.log(`Skipping item with different product ID: ${item.product._id}`);
        return;
      }
      
      console.log(`Processing booking ${booking._id}:`, {
        status: booking.status,
        quantity: item.quantity,
        startDate: item.startDate,
        endDate: item.endDate
      });
      
      totalBookedQuantity += item.quantity;
      console.log(`Added ${item.quantity}, total now: ${totalBookedQuantity}`);
    });
  });

  const remainingQuantity = this.quantity - totalBookedQuantity;
  const isAvailable = remainingQuantity >= requestedQuantity && this.isActive;

  console.log('Final availability calculation:', {
    productQuantity: this.quantity,
    totalBookedQuantity,
    remainingQuantity,
    requestedQuantity,
    isAvailable
  });

  return {
    isAvailable,
    totalQuantity: this.quantity,
    bookedQuantity: totalBookedQuantity,
    remainingQuantity,
    requestedQuantity,
    bookingInfo
  };
};

const Product = mongoose.model('Product', productSchema);

export default Product; 