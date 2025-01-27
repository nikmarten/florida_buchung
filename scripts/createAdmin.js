import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade die Umgebungsvariablen
dotenv.config({ path: join(__dirname, '../.env') });

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Definiere das User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

// Hash das Passwort vor dem Speichern
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

// Erstelle einen neuen Admin
async function createAdmin() {
  try {
    const admin = new User({
      username: 'admin',
      password: 'weltbestesteam', // Ändern Sie dies zu Ihrem gewünschten Passwort
      isAdmin: true,
    });

    await admin.save();
    console.log('Admin-Benutzer erfolgreich erstellt!');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Ein Benutzer mit diesem Namen existiert bereits.');
    } else {
      console.error('Fehler beim Erstellen des Admin-Benutzers:', error);
    }
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin(); 