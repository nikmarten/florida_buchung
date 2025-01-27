import express from 'express';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import { sendBookingConfirmation } from '../services/emailService.js';

const router = express.Router();

// Neue Buchung erstellen
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const savedBooking = await booking.save();
    
    // Erhöhe den bookingCount für jedes gebuchte Produkt
    for (const item of booking.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { bookingCount: 1 } }
      );
    }
    
    const populatedBooking = await Booking.findById(savedBooking._id).populate('items.productId');
    
    // E-Mail-Bestätigung senden
    try {
      await sendBookingConfirmation(populatedBooking);
      res.status(201).json(populatedBooking);
    } catch (emailError) {
      // Wenn das E-Mail-System deaktiviert ist, ignoriere E-Mail-Fehler
      if (process.env.ENABLE_EMAIL_SYSTEM !== 'true') {
        return res.status(201).json(populatedBooking);
      }
      
      // Ansonsten: Lösche die Buchung wieder und reduziere die bookingCounts
      for (const item of booking.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { bookingCount: -1 } }
        );
      }
      await Booking.findByIdAndDelete(savedBooking._id);
      res.status(500).json({ 
        message: 'Die Buchung konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut.',
        error: emailError.message 
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Alle Buchungen abrufen
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('items.productId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Einzelne Buchung abrufen
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('items.productId');
    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buchungsstatus aktualisieren
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Buchung löschen
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }
    await booking.deleteOne();
    res.json({ message: 'Buchung erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 