import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Alle Kategorien abrufen
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ label: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Neue Kategorie erstellen
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kategorie aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kategorie löschen
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategorie nicht gefunden' });
    }
    res.json({ message: 'Kategorie erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 