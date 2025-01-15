import express from 'express';
import Equipment from '../models/Equipment.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Alle Geräte abrufen
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verfügbare Geräte für einen Zeitraum abrufen
router.get('/available', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Hier später: Logik für die Verfügbarkeitsprüfung implementieren
    const equipment = await Equipment.find({ isAvailable: true });
    
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Neues Gerät hinzufügen (nur Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Gerät aktualisieren (nur Admin)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!equipment) {
      return res.status(404).json({ message: 'Gerät nicht gefunden' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Gerät löschen (nur Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Gerät nicht gefunden' });
    }
    res.json({ message: 'Gerät erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 