import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Bitte authentifizieren Sie sich' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isAdmin) {
        throw new Error();
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: 'Keine Administratorrechte' });
  }
}; 