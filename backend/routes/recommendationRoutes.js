const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Rating = require('../models/Rating');
const { checkIsInMemory, getInMemoryStore } = require('../config/db');
const mlService = require('../services/mlService');

// GET /api/recommendations/user (Protected)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    let userRatings = [];

    if (checkIsInMemory()) {
      const store = getInMemoryStore();
      userRatings = store.ratings.filter(r => String(r.userId) === String(userId));
    } else {
      userRatings = await Rating.find({ userId });
    }

    const result = await mlService.getUserRecommendations(userId, userRatings, 10);
    return res.json(result);
  } catch (err) {
    console.error('[Recommendation Route] User Rec Error:', err);
    return res.status(500).json({ message: 'Failed to generate personalized recommendations.' });
  }
});

// GET /api/recommendations/movie/:movieId
router.get('/movie/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const recommendations = await mlService.getSimilarMovies(movieId, 6);
    return res.json({ movieId, recommendations });
  } catch (err) {
    console.error('[Recommendation Route] Movie Rec Error:', err);
    return res.status(500).json({ message: 'Failed to generate item recommendations.' });
  }
});

// POST /api/recommendations/custom-inputs
router.post('/custom-inputs', async (req, res) => {
  try {
    const { genres, mood, era, minRating, promptQuery, userRatings, topN } = req.body;
    const result = await mlService.getCustomInputRecommendations({
      genres,
      mood,
      era,
      minRating,
      promptQuery,
      userRatings,
      topN
    });
    return res.json(result);
  } catch (err) {
    console.error('[Recommendation Route] Custom Inputs Rec Error:', err);
    return res.status(500).json({ message: 'Failed to generate recommendations based on custom inputs.' });
  }
});

module.exports = router;

