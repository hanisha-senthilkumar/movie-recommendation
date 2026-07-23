const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');
const { checkIsInMemory, getInMemoryStore } = require('../config/db');

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      if (store.users.has(normalizedEmail)) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const userId = `mem_user_${Date.now()}`;

      const newUser = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        watchlist: [],
        createdAt: new Date()
      };

      store.users.set(normalizedEmail, newUser);

      const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, COOKIE_OPTIONS);
      return res.status(201).json({
        user: { id: newUser.id, name: newUser.name, email: newUser.email, watchlist: newUser.watchlist },
        token
      });
    }

    // MongoDB Mode
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      watchlist: []
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    return res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, watchlist: user.watchlist },
      token
    });
  } catch (err) {
    console.error('[Auth Route] Register Error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      const user = store.users.get(normalizedEmail);

      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, COOKIE_OPTIONS);
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, watchlist: user.watchlist || [] },
        token
      });
    }

    // MongoDB Mode
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    return res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, watchlist: user.watchlist || [] },
      token
    });
  } catch (err) {
    console.error('[Auth Route] Login Error:', err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.json({ message: 'Signed out successfully.' });
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      const user = store.users.get(req.user.email);
      if (!user) return res.status(404).json({ message: 'User profile not found' });
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, watchlist: user.watchlist || [] }
      });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User profile not found' });

    return res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, watchlist: user.watchlist || [] }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
});

module.exports = router;
