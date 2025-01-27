import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Vor dem Speichern sicherstellen, dass order einen Wert hat
categorySchema.pre('save', async function(next) {
  if (this.isNew && this.order === undefined) {
    const maxOrder = await this.constructor.findOne({}, 'order').sort('-order');
    this.order = maxOrder ? maxOrder.order + 1 : 0;
  }
  next();
});

export default mongoose.model('Category', categorySchema); 