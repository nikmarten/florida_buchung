import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
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
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validierung der Kategorie gegen die Kategorien in der Datenbank
productSchema.pre('validate', async function(next) {
  try {
    const Category = mongoose.model('Category');
    const category = await Category.findOne({ value: this.category });
    if (!category) {
      this.invalidate('category', 'Category does not exist');
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema); 