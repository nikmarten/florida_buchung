import express from 'express';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Einzelne Buchung abrufen
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('items.product');
    
    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    
    // Check availability for each item
    for (const item of booking.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          message: `Produkt ${item.product} nicht gefunden` 
        });
      }
      
      const availability = await product.checkAvailability(
        new Date(item.startDate),
        new Date(item.endDate),
        item.quantity
      );
      
      if (!availability.isAvailable) {
        return res.status(400).json({ 
          message: `${product.name} ist im gewählten Zeitraum nicht verfügbar` 
        });
      }
    }
    
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rückgabestatus aktualisieren
router.put('/:id/return', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('items.product');

    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }

    // Update der Rückgabestatus für jedes Produkt
    booking.items = booking.items.map(item => {
      const updatedItem = req.body.items.find(
        update => update.product === item.product._id.toString()
      );

      if (updatedItem) {
        item.returnStatus = updatedItem.returnStatus;
        item.returnNotes = updatedItem.returnNotes;
        item.returnDate = updatedItem.returnDate;
      }

      return item;
    });

    // Prüfe ob alle Produkte zurückgegeben wurden
    const allReturned = booking.items.every(item => item.returnStatus === 'returned');
    if (allReturned) {
      booking.status = 'completed';
    }

    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('items.product');
    
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error updating booking return status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 