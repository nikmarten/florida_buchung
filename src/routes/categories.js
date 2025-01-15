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
    const category = new Category({
      value: req.body.value,
      label: req.body.label,
      description: req.body.description
    });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kategorie aktualisieren
router.put('/:id', async (req, res) => {
  try {
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

// Kategorie löschen
router.delete('/:id', async (req, res) => {
  try {
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

export default router; 