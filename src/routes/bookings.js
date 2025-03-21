import express from 'express';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import { sendNewBookingNotification, sendBookingConfirmation } from '../services/emailService.js';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      })
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
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      });
    
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
    
    // Finde das Produkt mit der längsten Sperrzeit
    let maxLockPeriod = 0;
    const products = [];
    
    for (const item of booking.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          message: `Produkt ${item.product} nicht gefunden` 
        });
      }
      products.push(product);
      maxLockPeriod = Math.max(maxLockPeriod, product.lockPeriodDays || 0);
    }

    // Erweitere die Buchungsdauer um die maximale Sperrzeit
    for (const item of booking.items) {
      const originalEndDate = new Date(item.endDate);
      originalEndDate.setDate(originalEndDate.getDate() + maxLockPeriod);
      item.endDate = originalEndDate;
    }

    // Debug-Logs für die Verfügbarkeitsprüfung
    console.log('Checking availability for booking:', {
      items: booking.items.map(item => ({
        product: item.product,
        startDate: item.startDate,
        endDate: item.endDate,
        quantity: item.quantity
      }))
    });

    // Prüfe die Verfügbarkeit für jedes Produkt mit der erweiterten Dauer
    for (let i = 0; i < booking.items.length; i++) {
      const item = booking.items[i];
      const product = products[i];

      console.log('Checking product:', {
        productId: product._id,
        productName: product.name,
        totalQuantity: product.quantity,
        requestedQuantity: item.quantity
      });

      const availability = await product.checkAvailability(
        new Date(item.startDate),
        new Date(item.endDate),
        item.quantity
      );
      
      console.log('Availability result:', availability);
      
      if (!availability.isAvailable) {
        return res.status(400).json({ 
          message: `${product.name} ist im gewählten Zeitraum (inkl. Sperrzeit von ${maxLockPeriod} Tagen) nicht in der gewünschten Menge (${item.quantity}) verfügbar. Verfügbare Menge: ${availability.remainingQuantity}` 
        });
      }
    }
    
    const savedBooking = await booking.save();

    // Lade die gespeicherte Buchung mit allen Produkt-Details
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity lockPeriodDays'
      });

    // Sende E-Mail-Benachrichtigungen
    try {
      // Sende Bestätigung an den Kunden
      await sendBookingConfirmation(populatedBooking);
      // Sende Benachrichtigung an die Administratoren
      await sendNewBookingNotification(populatedBooking);
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail-Benachrichtigungen:', error);
      // Wir werfen hier keinen Fehler, da die Buchung trotzdem erfolgreich war
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
});

// Rückgabestatus aktualisieren
router.put('/:id/return', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      });

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
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      });
    
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error updating booking return status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buchung stornieren
router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      });

    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }

    // Prüfe ob die Buchung bereits storniert oder abgeschlossen ist
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Buchung wurde bereits storniert' });
    }
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Abgeschlossene Buchungen können nicht storniert werden' });
    }

    // Setze den Status auf storniert
    booking.status = 'cancelled';
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      });
    
    res.json(populatedBooking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Buchung bearbeiten
router.put('/:id', async (req, res) => {
  try {
    const { status, items } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Buchung nicht gefunden' });
    }

    // Prüfe ob der neue Status gültig ist
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }

    // Aktualisiere den Status
    booking.status = status;

    // Aktualisiere die Items
    if (items && items.length > 0) {
      booking.items = items;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name description imageUrl category quantity'
      });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 