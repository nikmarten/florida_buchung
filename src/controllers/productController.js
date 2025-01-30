import Product from '../models/Product';
import Booking from '../models/Booking';

/**
 * Gibt die Verfügbarkeit eines Produkts für einen bestimmten Zeitraum frei
 */
export const releaseAvailability = async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.body;

    // Validiere die Eingabedaten
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start- und Enddatum sind erforderlich' });
    }

    // Finde das Produkt
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    // Finde alle aktiven Buchungen für dieses Produkt
    const activeBookings = await Booking.find({
      'items': {
        $elemMatch: {
          'productId': productId,
          'returnStatus': { $ne: 'returned' },
          $or: [
            {
              'startDate': { $lte: new Date(endDate) },
              'endDate': { $gte: new Date(startDate) }
            }
          ]
        }
      }
    });

    // Entferne die freigegebene Buchung aus den aktiven Buchungen
    const remainingBookings = activeBookings.filter(booking => 
      !booking.items.some(item => 
        new Date(item.startDate).getTime() === new Date(startDate).getTime() &&
        new Date(item.endDate).getTime() === new Date(endDate).getTime()
      )
    );

    // Wenn keine weiteren Buchungen in diesem Zeitraum existieren,
    // können wir das Produkt als verfügbar markieren
    const isTimeSlotAvailable = remainingBookings.length === 0;

    if (isTimeSlotAvailable) {
      // Aktualisiere die Verfügbarkeit des Produkts
      product.availabilitySchedule = product.availabilitySchedule || [];
      
      // Füge den freigegebenen Zeitraum zur Verfügbarkeit hinzu
      product.availabilitySchedule.push({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isAvailable: true
      });

      // Sortiere und bereinige überlappende Zeiträume
      product.availabilitySchedule = mergeAvailabilitySchedule(product.availabilitySchedule);
    }

    await product.save();

    res.status(200).json({
      message: 'Verfügbarkeit erfolgreich aktualisiert',
      isTimeSlotAvailable,
      product
    });

  } catch (error) {
    console.error('Fehler beim Aktualisieren der Verfügbarkeit:', error);
    res.status(500).json({ 
      message: 'Fehler beim Aktualisieren der Verfügbarkeit',
      error: error.message 
    });
  }
};

/**
 * Hilfsfunktion zum Zusammenführen und Bereinigen von Verfügbarkeitszeiträumen
 */
function mergeAvailabilitySchedule(schedule) {
  if (!schedule || schedule.length === 0) return [];

  // Sortiere nach Startdatum
  const sorted = [...schedule].sort((a, b) => a.startDate - b.startDate);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // Wenn sich die Zeiträume überlappen
    if (current.startDate <= last.endDate) {
      // Erweitere den bestehenden Zeitraum wenn nötig
      if (current.endDate > last.endDate) {
        last.endDate = current.endDate;
      }
    } else {
      // Füge neuen Zeitraum hinzu
      merged.push(current);
    }
  }

  return merged;
} 