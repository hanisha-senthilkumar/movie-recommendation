import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// Movie Meta APIs
export const getTrendingMovies = (lang = null) => api.get(`/movies/trending${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`);
export const getPopularMovies = () => api.get('/movies/popular');
export const searchMovies = (query, lang = null) => api.get(`/movies/search?query=${encodeURIComponent(query)}${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`);
export const getMovieDetails = (id) => api.get(`/movies/${id}`);
export const getMoviesByMood = (mood) => api.get(`/movies/mood/${encodeURIComponent(mood)}`);

// Rating APIs
export const getUserRatings = () => api.get('/ratings/user');
export const submitRating = (movieId, rating) => api.post('/ratings', { movieId, rating });

// Watchlist APIs
export const getWatchlist = () => api.get('/watchlist');
export const toggleWatchlist = (movieId) => api.post('/watchlist/toggle', { movieId });

// KNN Recommendation APIs
export const getUserRecommendations = () => api.get('/recommendations/user');
export const getSimilarMovies = (movieId) => api.get(`/recommendations/movie/${movieId}`);
export const getCustomInputRecommendations = (preferences) => api.post('/recommendations/custom-inputs', preferences);

export default api;
