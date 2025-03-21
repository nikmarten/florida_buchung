import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lade .env-Datei basierend auf NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
const envPath = path.resolve(__dirname, '..', '..', envFile);

console.log('Lade Umgebungsvariablen aus:', envPath);
dotenv.config({ path: envPath });

// Validiere wichtige Umgebungsvariablen
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'NOTIFICATION_EMAIL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Fehlende Umgebungsvariablen:', missingEnvVars);
  throw new Error('Umgebungsvariablen unvollständig');
}

// Logge geladene Umgebungsvariablen (ohne sensible Daten)
console.log('Geladene Umgebungsvariablen:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'MongoDB URI ist gesetzt' : 'MongoDB URI fehlt',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER ? 'SMTP User ist gesetzt' : 'SMTP User fehlt'
}); 