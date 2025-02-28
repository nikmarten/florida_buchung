import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on NODE_ENV
console.log('Initial NODE_ENV:', process.env.NODE_ENV);

// For development with nodemon, force development mode
if (process.argv[1].includes('nodemon') || process.env.NODE_ENV === 'development') {
  process.env.NODE_ENV = 'development';
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env' });
}

// Import routes after environment variables are loaded
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import bookingsRouter from './routes/bookings.js';

// Debug logging
console.log('NODE_ENV after config:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/bookings', bookingsRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message || 'Ein unerwarteter Fehler ist aufgetreten'
  });
});

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('MongoDB URI:', process.env.MONGODB_URI);
  });

// Graceful Shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
}); 