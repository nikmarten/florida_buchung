import express from 'express';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      quantity: req.body.quantity,
      lockPeriodDays: req.body.lockPeriodDays
    });

    const newProduct = await product.save();
    const populatedProduct = await Product.findById(newProduct._id).populate('category');
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    if (req.body.imageUrl) product.imageUrl = req.body.imageUrl;
    if (req.body.quantity !== undefined) product.quantity = req.body.quantity;
    if (req.body.lockPeriodDays !== undefined) product.lockPeriodDays = req.body.lockPeriodDays;

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate('category');
    res.json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    await product.deleteOne();
    res.json({ message: 'Produkt erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verfügbarkeitsprüfung für ein Produkt
router.get('/:id/availability', async (req, res) => {
  try {
    const { startDate, endDate, quantity = 1 } = req.query;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produkt nicht gefunden' });
    }

    const availability = await product.checkAvailability(
      new Date(startDate),
      new Date(endDate),
      parseInt(quantity)
    );

    res.json(availability);
  } catch (error) {
    console.error('Error checking product availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 