import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade .env aus dem Hauptverzeichnis
dotenv.config({ path: join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'MongoDB URI nicht gefunden. Bitte stellen Sie sicher, dass die .env Datei existiert und MONGODB_URI enthält.\n' +
    'Aktueller Wert: ' + MONGODB_URI + '\n' +
    'Erwarteter Wert: mongodb://localhost:27017/florida_technik'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('MongoDB erfolgreich verbunden!');
        return mongoose;
      });
    } catch (error) {
      console.error('MongoDB Verbindungsfehler:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Cache-Fehler:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB; 