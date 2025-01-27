import express from 'express';
import Category from '../models/Category.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Alle Kategorien abrufen
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('order');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Neue Kategorie erstellen
router.post('/', adminAuth, async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kategorie aktualisieren
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }

    // Wenn sich die Reihenfolge ändert, aktualisiere andere Kategorien
    if (req.body.order !== undefined && req.body.order !== category.order) {
      const oldOrder = category.order;
      const newOrder = req.body.order;

      // Aktualisiere die Reihenfolge anderer Kategorien
      if (oldOrder < newOrder) {
        await Category.updateMany(
          { order: { $gt: oldOrder, $lte: newOrder } },
          { $inc: { order: -1 } }
        );
      } else {
        await Category.updateMany(
          { order: { $gte: newOrder, $lt: oldOrder } },
          { $inc: { order: 1 } }
        );
      }
    }

    Object.assign(category, req.body);
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kategorie löschen
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }

    const deletedOrder = category.order;
    await category.remove();

    // Aktualisiere die Reihenfolge der verbleibenden Kategorien
    await Category.updateMany(
      { order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    );

    res.json({ message: 'Kategorie erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 