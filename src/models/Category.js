import mongoose from 'mongoose';

// Altes Model löschen, falls es existiert
try {
  mongoose.deleteModel('Category');
} catch (error) {
  // Model existiert noch nicht, das ist OK
}

// Schema neu definieren
const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generiere den value aus dem label
categorySchema.virtual('value').get(function() {
  if (!this.label) return '';
  return this.label
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const map = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
      return map[match];
    })
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
});

// Model neu erstellen
const Category = mongoose.model('Category', categorySchema);

export default Category; 