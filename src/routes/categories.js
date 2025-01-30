import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Neue Kategorie erstellen
router.post('/', async (req, res) => {
  try {
    const category = new Category({
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
    if (!req.body.label || !req.body.label.trim()) {
      return res.status(400).json({ 
        message: 'Ein Name für die Kategorie ist erforderlich' 
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        message: 'Kategorie nicht gefunden' 
      });
    }

    // Prüfe ob eine andere Kategorie mit diesem Label bereits existiert
    const existingCategory = await Category.findOne({
      label: req.body.label.trim(),
      _id: { $ne: req.params.id }
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Eine andere Kategorie mit diesem Namen existiert bereits' 
      });
    }

    category.label = req.body.label.trim();
    if (req.body.description !== undefined) {
      category.description = req.body.description.trim();
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ 
      message: 'Fehler beim Aktualisieren der Kategorie',
      error: error.message 
    });
  }
});

// Kategorie löschen
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        message: 'Kategorie nicht gefunden' 
      });
    }

    await category.deleteOne();
    res.json({ message: 'Kategorie erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      message: 'Fehler beim Löschen der Kategorie',
      error: error.message 
    });
  }
});

export default router; 