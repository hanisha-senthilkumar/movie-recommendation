const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { authMiddleware } = require('../middleware/auth');
const { checkIsInMemory, getInMemoryStore } = require('../config/db');
const mlService = require('../services/mlService');

// POST /api/ratings (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    if (!movieId || !rating) {
      return res.status(400).json({ message: 'Movie ID and rating (0.5 to 5.0) are required.' });
    }

    const numMovieId = Number(movieId);
    const numRating = Number(rating);

    if (numRating < 0.5 || numRating > 5.0) {
      return res.status(400).json({ message: 'Rating must be between 0.5 and 5.0 stars.' });
    }

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      const existingIdx = store.ratings.findIndex(
        r => String(r.userId) === String(userId) && Number(r.movieId) === numMovieId
      );

      if (existingIdx >= 0) {
        store.ratings[existingIdx].rating = numRating;
        store.ratings[existingIdx].updatedAt = new Date();
      } else {
        store.ratings.push({
          userId: String(userId),
          movieId: numMovieId,
          rating: numRating,
          updatedAt: new Date()
        });
      }

      // Sync ratings with ML service
      mlService.syncRatings(store.ratings);

      return res.json({
        message: 'Rating saved successfully!',
        rating: { userId, movieId: numMovieId, rating: numRating }
      });
    }

    // MongoDB Mode
    const updated = await Rating.findOneAndUpdate(
      { userId, movieId: numMovieId },
      { rating: numRating, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Fetch all user ratings to sync
    const allRatings = await Rating.find().limit(500);
    mlService.syncRatings(allRatings);

    return res.json({
      message: 'Rating saved successfully!',
      rating: updated
    });
  } catch (err) {
    console.error('[Rating Route] Error:', err);
    return res.status(500).json({ message: 'Failed to save rating.' });
  }
});

// GET /api/ratings/user (Protected)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      const userRatings = store.ratings.filter(r => String(r.userId) === String(userId));
      return res.json({ ratings: userRatings });
    }

    const ratings = await Rating.find({ userId }).sort({ updatedAt: -1 });
    return res.json({ ratings });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user ratings.' });
  }
});

module.exports = router;
