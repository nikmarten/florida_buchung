import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../src/lib/mongodb.js';
import Product from '../src/models/Product.js';
import Booking from '../src/models/Booking.js';
import Category from '../src/models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lade .env aus dem Hauptverzeichnis
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kategorie-Routen
app.get('/api/categories', async (req, res) => {
  try {
    await connectDB();
    const categories = await Category.find().sort({ label: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    await connectDB();
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    await connectDB();
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }

    if (req.body.value) category.value = req.body.value;
    if (req.body.label) category.label = req.body.label;
    if (req.body.description !== undefined) category.description = req.body.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await connectDB();
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }

    await category.deleteOne();
    res.json({ message: 'Kategorie erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Produkt-Routen
app.get('/api/products', async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await connectDB();
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }
    res.json({ message: 'Produkt erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buchungs-Routen
app.get('/api/bookings', async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({}).populate('items.equipment');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    await connectDB();
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    await connectDB();
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.equipment');
    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verfügbarkeits-Check
app.post('/api/availability', async (req, res) => {
  try {
    await connectDB();
    const { startDate, endDate, productId } = req.body;
    
    const overlappingBookings = await Booking.find({
      'items.equipment': productId,
      'items.startDate': { $lt: endDate },
      'items.endDate': { $gt: startDate },
      status: { $in: ['PENDING', 'APPROVED'] }
    });

    res.json({ available: overlappingBookings.length === 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 