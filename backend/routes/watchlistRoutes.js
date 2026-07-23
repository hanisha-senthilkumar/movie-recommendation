const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { checkIsInMemory, getInMemoryStore } = require('../config/db');
const tmdbService = require('../services/tmdbService');

// POST /api/watchlist/toggle (Protected)
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required.' });
    }

    const numMovieId = Number(movieId);

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      const user = store.users.get(req.user.email);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      let list = user.watchlist || [];
      let inWatchlist = false;

      if (list.includes(numMovieId)) {
        list = list.filter(id => id !== numMovieId);
        inWatchlist = false;
      } else {
        list.push(numMovieId);
        inWatchlist = true;
      }

      user.watchlist = list;
      return res.json({
        message: inWatchlist ? 'Added to your watchlist!' : 'Removed from your watchlist.',
        inWatchlist,
        watchlist: list
      });
    }

    // MongoDB Mode
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    let list = user.watchlist || [];
    let inWatchlist = false;

    if (list.includes(numMovieId)) {
      list = list.filter(id => id !== numMovieId);
      inWatchlist = false;
    } else {
      list.push(numMovieId);
      inWatchlist = true;
    }

    user.watchlist = list;
    await user.save();

    return res.json({
      message: inWatchlist ? 'Added to your watchlist!' : 'Removed from your watchlist.',
      inWatchlist,
      watchlist: list
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update watchlist.' });
  }
});

// GET /api/watchlist (Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let watchlistIds = [];

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      const user = store.users.get(req.user.email);
      watchlistIds = user ? (user.watchlist || []) : [];
    } else {
      const user = await User.findById(req.user.id);
      watchlistIds = user ? (user.watchlist || []) : [];
    }

    const movies = await Promise.all(
      watchlistIds.map(id => tmdbService.getMovieDetails(id))
    );

    return res.json({ watchlist: movies.filter(Boolean) });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch watchlist.' });
  }
});

module.exports = router;
