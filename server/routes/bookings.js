import express from 'express';
import Booking from '../models/Booking.js';
import Equipment from '../models/Equipment.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Alle Buchungen abrufen (nur Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('equipment');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Neue Buchung erstellen
router.post('/', async (req, res) => {
  try {
    const { equipment, startDate, endDate, user } = req.body;

    // Verfügbarkeit prüfen
    const overlappingBookings = await Booking.find({
      equipment: { $in: equipment },
      status: 'CONFIRMED',
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Ein oder mehrere Geräte sind im gewählten Zeitraum nicht verfügbar' 
      });
    }

    const booking = new Booking({
      equipment,
      startDate,
      endDate,
      user
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Buchungsstatus aktualisieren (nur Admin)
router.patch('/:id/status', adminAuth, async (req, res) => {
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

// Buchung stornieren
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }

    booking.status = 'CANCELLED';
    await booking.save();
    
    res.json({ message: 'Buchung erfolgreich storniert' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 