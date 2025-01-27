import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import './lib/mongodb.js';

import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

// CORS Konfiguration
app.use(cors({
  origin: [
    'http://website.livinik.de',
    'https://website.livinik.de',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://192.168.0.23:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ein Fehler ist aufgetreten!' });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 