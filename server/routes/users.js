import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Neuen Admin erstellen (nur für existierende Admins)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username,
      password,
      isAdmin: true,
    });

    await user.save();
    res.status(201).json({ message: 'Admin erfolgreich erstellt' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 