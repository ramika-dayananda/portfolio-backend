import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

// normal auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, me);

// ⭐ TEMP ADMIN ROUTE — INSERT HERE ⭐
router.post('/create-admin', async (req, res) => {
  try {
    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "Admin123!",   // NOT HASHED — model will hash it
      role: "admin",
    });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to create admin" });
  }
});

// DO NOT TOUCH BELOW
export default router;
