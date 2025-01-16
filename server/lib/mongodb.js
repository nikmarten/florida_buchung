import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI ist nicht in den Umgebungsvariablen definiert!');
  process.exit(1);
}

try {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Erfolgreich mit MongoDB Atlas verbunden!');
} catch (error) {
  console.error('Fehler beim Verbinden mit MongoDB:', error);
  process.exit(1);
}

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

export default mongoose.connection; 