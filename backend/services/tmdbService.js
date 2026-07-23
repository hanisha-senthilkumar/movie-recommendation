const axios = require('axios');
const { MOVIES_DATABASE } = require('./movieDatasetLoader');

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1400&q=80';

const toSeedValue = (m) => {
  const base = `${m?.id || 'movie'}-${m?.title || m?.original_title || 'cinematch'}`;
  return encodeURIComponent(base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
};

const getUniqueMediaUrl = (rawValue, fallback, seenSet, m, type) => {
  const normalized = rawValue
    ? (rawValue.startsWith('http') ? rawValue : `${type === 'poster' ? IMAGE_BASE_URL : BACKDROP_BASE_URL}${rawValue}`)
    : fallback;

  if (normalized && !seenSet.has(normalized)) {
    seenSet.add(normalized);
    return normalized;
  }

  const seed = toSeedValue(m);
  const uniqueFallback = type === 'poster'
    ? `https://picsum.photos/seed/${seed}/500/750`
    : `https://picsum.photos/seed/${seed}-backdrop/1400/800`;

  if (!seenSet.has(uniqueFallback)) {
    seenSet.add(uniqueFallback);
    return uniqueFallback;
  }

  return uniqueFallback + `?v=${Date.now()}`;
};

const normalizeMovieArtwork = (list) => {
  const seenPoster = new Set();
  const seenBackdrop = new Set();

  return list.map((m) => {
    if (!m) return m;
    return {
      ...m,
      poster_path: getUniqueMediaUrl(m.poster_path, FALLBACK_POSTER, seenPoster, m, 'poster'),
      backdrop_path: getUniqueMediaUrl(m.backdrop_path, FALLBACK_BACKDROP, seenBackdrop, m, 'backdrop')
    };
  });
};

const formatMovie = (m) => {
  if (!m) return null;
  const poster = m.poster_path
    ? (m.poster_path.startsWith('http') ? m.poster_path : `${IMAGE_BASE_URL}${m.poster_path}`)
    : FALLBACK_POSTER;
  const backdrop = m.backdrop_path
    ? (m.backdrop_path.startsWith('http') ? m.backdrop_path : `${BACKDROP_BASE_URL}${m.backdrop_path}`)
    : FALLBACK_BACKDROP;

  return {
    id: m.id,
    title: m.title,
    original_title: m.original_title || m.title,
    language: m.language || 'English',
    tagline: m.tagline || '',
    overview: m.overview || 'No overview available.',
    poster_path: poster,
    backdrop_path: backdrop,
    vote_average: m.vote_average ? Number(m.vote_average.toFixed(1)) : 8.0,
    vote_count: m.vote_count || 1500,
    release_date: m.release_date || '2023-01-01',
    release_year: m.release_date ? m.release_date.split('-')[0] : '2023',
    runtime: m.runtime || 135,
    director: m.director || 'Renowned Director',
    genres: Array.isArray(m.genres) ? m.genres.map(g => (typeof g === 'string' ? g : g.name)) : ['Drama'],
    cast: Array.isArray(m.cast) ? m.cast.map(c => typeof c === 'string' ? { name: c, character: 'Lead Role' } : c) : [],
    keywords: m.keywords || [],
    production_company: m.production_company || 'CineMatch Studios',
    country: m.country || 'International',
    ott_providers: m.ott_providers || ['Netflix', 'Prime Video', 'Disney+ Hotstar'],
    source: m.source || 'cinematch-dataset'
  };
};

const getTrendingMovies = async (language = null) => {
  let list = normalizeMovieArtwork(MOVIES_DATABASE);
  if (language && language !== 'All') {
    list = list.filter(m => (m.language || '').toLowerCase() === language.toLowerCase());
  }
  return list.map(formatMovie);
};

const getPopularMovies = async () => {
  return normalizeMovieArtwork(MOVIES_DATABASE).map(formatMovie);
};

const getMovieDetails = async (movieId) => {
  const numId = Number(movieId);
  const localMovie = normalizeMovieArtwork(MOVIES_DATABASE).find(m => m.id === numId);
  if (localMovie) return formatMovie(localMovie);

  if (TMDB_API_KEY) {
    try {
      const res = await axios.get(`${TMDB_BASE_URL}/movie/${numId}?api_key=${TMDB_API_KEY}&append_to_response=credits`);
      if (res.data) {
        const raw = res.data;
        const cast = raw.credits && raw.credits.cast ? raw.credits.cast.slice(0, 8).map(c => ({
          name: c.name,
          character: c.character
        })) : [];
        const directorObj = raw.credits && raw.credits.crew ? raw.credits.crew.find(c => c.job === 'Director') : null;
        const normalizedRemote = normalizeMovieArtwork([{ ...raw, cast, director: directorObj ? directorObj.name : 'Director' }])[0];
        return formatMovie(normalizedRemote);
      }
    } catch (e) {
      console.warn(`[TMDB Service] API request failed for ID ${numId}`);
    }
  }

  // Fallback for ID if not found
  // Use null poster/backdrop so normalizeMovieArtwork will assign a guaranteed unique fallback
  const fallbackMovie = normalizeMovieArtwork([{
    id: numId,
    title: `CineMatch Masterpiece #${numId}`,
    language: 'English',
    overview: "A gripping cinematic marvel featuring award-winning performances, stunning visuals, and unforgettable storytelling.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.2,
    release_date: "2023-08-15",
    director: "CineMatch Studio",
    genres: ["Action", "Drama", "Thriller"]
  }])[0];

  return formatMovie(fallbackMovie);
};

const searchMovies = async (query, langFilter = null) => {
  if (!query || !query.trim()) {
    return getTrendingMovies(langFilter);
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  let results = normalizeMovieArtwork(MOVIES_DATABASE).filter(m => {
    const title = (m.title || '').toLowerCase();
    const origTitle = (m.original_title || '').toLowerCase();
    const director = (m.director || '').toLowerCase();
    const language = (m.language || '').toLowerCase();
    const year = (m.release_date || '').split('-')[0];
    const castNames = (m.cast || []).map(c => (typeof c === 'string' ? c : c.name)).join(' ').toLowerCase();
    const genres = (m.genres || []).join(' ').toLowerCase();
    const keywords = (m.keywords || []).join(' ').toLowerCase();
    const overview = (m.overview || '').toLowerCase();
    const searchable = `${title} ${origTitle} ${director} ${language} ${year} ${castNames} ${genres} ${keywords} ${overview}`;

    return terms.every(term => searchable.includes(term));
  });

  if (langFilter && langFilter !== 'All') {
    results = results.filter(m => (m.language || '').toLowerCase() === langFilter.toLowerCase());
  }

  return results.slice(0, 60).map(formatMovie);
};

// Mood Recommendation Mapping
const MOOD_MAP = {
  'Happy': ['Comedy', 'Animation', 'Feel Good', 'Family'],
  'Comedy': ['Comedy'],
  'Romantic': ['Romance', 'Drama'],
  'Sad': ['Drama', 'Emotional'],
  'Horror': ['Horror', 'Mystery', 'Thriller'],
  'Action': ['Action', 'Adventure'],
  'Mind-bending': ['Sci-Fi', 'Mystery', 'Thriller'],
  'Family': ['Family', 'Animation', 'Adventure'],
  'Feel Good': ['Comedy', 'Drama', 'Romance'],
  'Emotional': ['Drama', 'Biography'],
  'Crime': ['Crime', 'Action', 'Thriller'],
  'Mystery': ['Mystery', 'Thriller']
};

const getMoviesByMood = (mood) => {
  const targetGenres = MOOD_MAP[mood] || ['Drama', 'Action'];
  const matched = normalizeMovieArtwork(MOVIES_DATABASE).filter(m => {
    const genresLower = m.genres.map(g => g.toLowerCase());
    const keywordsLower = (m.keywords || []).map(k => k.toLowerCase());
    return targetGenres.some(tg => genresLower.includes(tg.toLowerCase()) || keywordsLower.includes(tg.toLowerCase()));
  });
  return matched.map(formatMovie);
};

module.exports = {
  getTrendingMovies,
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  getMoviesByMood,
  formatMovie,
  FALLBACK_MOVIES: MOVIES_DATABASE
};

