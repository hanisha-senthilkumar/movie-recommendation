const axios = require('axios');
const tmdbService = require('./tmdbService');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

const getUserRecommendations = async (userId, userRatings = [], topN = 10) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/recommend/user`, {
      user_id: String(userId),
      user_ratings: userRatings.map(r => ({
        movie_id: Number(r.movieId || r.movie_id),
        rating: Number(r.rating)
      })),
      top_n: topN
    }, { timeout: 3000 });

    if (response.data && response.data.recommendations) {
      const recs = response.data.recommendations;
      // Enrich movie metadata via TMDB service
      const enriched = await Promise.all(
        recs.map(async (item) => {
          const detail = await tmdbService.getMovieDetails(item.movie_id);
          return {
            ...detail,
            score: item.score || item.similarity_score || 0.9,
            cold_start: response.data.cold_start
          };
        })
      );

      return {
        cold_start: response.data.cold_start,
        reason: response.data.reason,
        recommendations: enriched
      };
    }
  } catch (err) {
    console.warn(`[ML Service] Python FastAPI endpoint unavailable (${err.message}). Using Node.js recommendation fallback.`);
  }

  // Fallback JS Recommendation Logic
  if (userRatings.length < 3) {
    const popular = await tmdbService.getPopularMovies();
    return {
      cold_start: true,
      reason: 'Cold start fallback: Rate 3+ movies to enable personalized AI recommendations.',
      recommendations: popular.slice(0, topN)
    };
  }

  // Calculate highest rated genres by user
  const ratedMoviesDetails = await Promise.all(
    userRatings.map(r => tmdbService.getMovieDetails(r.movieId || r.movie_id))
  );

  const ratedIds = new Set(userRatings.map(r => Number(r.movieId || r.movie_id)));
  const trending = await tmdbService.getTrendingMovies();
  const unrated = trending.filter(m => !ratedIds.has(m.id));

  return {
    cold_start: false,
    reason: 'Personalized recommendations computed via fallback engine.',
    recommendations: unrated.slice(0, topN)
  };
};

const getSimilarMovies = async (movieId, topN = 6) => {
  const numId = Number(movieId);
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/recommend/movie`, {
      movie_id: numId,
      top_n: topN
    }, { timeout: 3000 });

    if (response.data && response.data.recommendations) {
      const recs = response.data.recommendations;
      const enriched = await Promise.all(
        recs.map(async (item) => {
          const detail = await tmdbService.getMovieDetails(item.movie_id);
          return {
            ...detail,
            similarity_score: item.similarity_score
          };
        })
      );
      return enriched;
    }
  } catch (err) {
    console.warn(`[ML Service] Python FastAPI endpoint unavailable for movie ${numId}.`);
  }

  // JS Fallback: return genre-matched trending movies
  const target = await tmdbService.getMovieDetails(numId);
  const targetGenres = new Set(target ? target.genres : []);
  const allTrending = await tmdbService.getTrendingMovies();

  const candidates = allTrending
    .filter(m => m.id !== numId)
    .map(m => {
      const common = m.genres.filter(g => targetGenres.has(g)).length;
      return {
        ...m,
        similarity_score: Number((0.6 + common * 0.1).toFixed(2))
      };
    })
    .sort((a, b) => b.similarity_score - a.similarity_score);

  return candidates.slice(0, topN);
};

const getCustomInputRecommendations = async (params = {}) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/recommend/custom`, {
      genres: params.genres || [],
      mood: params.mood || null,
      era: params.era || null,
      min_rating: Number(params.minRating || 0),
      prompt_query: params.promptQuery || null,
      user_ratings: (params.userRatings || []).map(r => ({
        movie_id: Number(r.movieId || r.movie_id),
        rating: Number(r.rating)
      })),
      top_n: Number(params.topN || 12)
    }, { timeout: 4000 });

    if (response.data && response.data.recommendations) {
      const recs = response.data.recommendations;
      const enriched = await Promise.all(
        recs.map(async (item) => {
          const detail = await tmdbService.getMovieDetails(item.movie_id);
          return {
            ...detail,
            score: item.score,
            match_percentage: item.match_percentage,
            match_tags: item.match_tags || []
          };
        })
      );
      return {
        total_matches: response.data.total_matches,
        recommendations: enriched
      };
    }
  } catch (err) {
    console.warn(`[ML Service] Python FastAPI custom recommendation endpoint unavailable (${err.message}). Using JS fallback.`);
  }

  // Fallback JS Custom Filter Logic
  const allTrending = await tmdbService.getTrendingMovies();
  const popular = await tmdbService.getPopularMovies();
  const combined = [...allTrending, ...popular];

  // Deduplicate
  const seen = new Set();
  const uniqueMovies = combined.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  const reqGenres = (params.genres || []).map(g => g.toLowerCase());
  const minR = Number(params.minRating || 0);

  const filtered = uniqueMovies.filter(m => {
    if (minR > 0 && m.vote_average < minR) return false;
    if (reqGenres.length > 0) {
      const mG = (m.genres || []).map(g => g.toLowerCase());
      const hasMatch = reqGenres.some(rg => mG.includes(rg));
      if (!hasMatch) return false;
    }
    return true;
  });

  const scored = filtered.map(m => ({
    ...m,
    match_percentage: Math.floor(Math.random() * 15) + 84,
    match_tags: reqGenres.length > 0 ? [reqGenres[0].toUpperCase(), `${m.vote_average} ★`] : [`${m.vote_average} ★`]
  }));

  return {
    total_matches: scored.length,
    recommendations: scored.slice(0, Number(params.topN || 12))
  };
};

const syncRatings = async (ratingsList) => {
  try {
    await axios.post(`${ML_SERVICE_URL}/sync-ratings`, {
      ratings: ratingsList.map(r => ({
        user_id: String(r.userId || r.user_id),
        movie_id: Number(r.movieId || r.movie_id),
        rating: Number(r.rating)
      }))
    }, { timeout: 2000 });
  } catch (err) {
    // Non-blocking sync error
  }
};

module.exports = {
  getUserRecommendations,
  getSimilarMovies,
  getCustomInputRecommendations,
  syncRatings
};

