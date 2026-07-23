const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService');

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
  try {
    const lang = req.query.language || req.query.lang || null;
    const movies = await tmdbService.getTrendingMovies(lang);
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending movies.' });
  }
});

// GET /api/movies/popular
router.get('/popular', async (req, res) => {
  try {
    const movies = await tmdbService.getPopularMovies();
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular movies.' });
  }
});

// GET /api/movies/search?query=...&lang=...
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query || '';
    const lang = req.query.language || req.query.lang || null;
    const movies = await tmdbService.searchMovies(query, lang);
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: 'Search query failed.' });
  }
});

// GET /api/movies/mood/:mood
router.get('/mood/:mood', async (req, res) => {
  try {
    const movies = tmdbService.getMoviesByMood(req.params.mood);
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mood movies.' });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await tmdbService.getMovieDetails(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie details not found.' });
    }
    res.json({ movie });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie details.' });
  }
});

module.exports = router;

