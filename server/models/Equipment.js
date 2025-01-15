import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['CAMERA', 'AUDIO'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Equipment', equipmentSchema); 