const fs = require('fs');
const path = require('path');
const axios = require('axios');

const FALLBACK_DATASET = require('./realMovieDataset').MOVIES_DATABASE || [];
const DATASET_PATH = process.env.MOVIE_DATASET_PATH || path.join(__dirname, '..', 'data', 'movie_catalog.json');
const DATASET_URL = process.env.MOVIE_DATASET_URL || '';

const isArrayOfObjects = (value) => Array.isArray(value) && value.every(item => item && typeof item === 'object');

const loadRemoteDataset = async () => {
  if (!DATASET_URL) return null;

  try {
    const response = await axios.get(DATASET_URL, { timeout: 15000 });
    if (isArrayOfObjects(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.movies)) return response.data.movies;
    if (response.data && Array.isArray(response.data.results)) return response.data.results;
  } catch (error) {
    console.warn('[Movie Dataset Loader] Remote dataset unavailable, falling back to local catalog.', error.message);
  }

  return null;
};

const loadMovieDataset = () => {
  try {
    if (fs.existsSync(DATASET_PATH)) {
      const raw = fs.readFileSync(DATASET_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (isArrayOfObjects(parsed)) {
        // Merge parsed local catalog with built-in fallback dataset to ensure IDs used
        // by other services (ML engine) are present. Local catalog entries take precedence.
        const byId = new Map();
        parsed.forEach(p => byId.set(p.id, p));
        FALLBACK_DATASET.forEach(f => {
          if (!byId.has(f.id)) byId.set(f.id, f);
        });
        return Array.from(byId.values());
      }
    }
  } catch (error) {
    console.warn('[Movie Dataset Loader] Local dataset could not be parsed, using built-in fallback.', error.message);
  }

  return FALLBACK_DATASET;
};

const MOVIES_DATABASE = loadMovieDataset();

module.exports = {
  MOVIES_DATABASE,
  loadMovieDataset,
  loadRemoteDataset
};
