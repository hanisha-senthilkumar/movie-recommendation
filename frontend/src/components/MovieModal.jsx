import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Bookmark, Check, Sparkles, Clock, Calendar, Film } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { MovieCard } from './MovieCard';
import { getMovieDetails, getSimilarMovies, submitRating, getUserRatings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const MovieModal = ({ movieId, onClose, onRatingUpdated }) => {
  const { user, toggleUserWatchlist } = useAuth();
  const { addToast } = useToast();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (movieId) {
      loadMovieDetails(movieId);
    }
  }, [movieId]);

  const loadMovieDetails = async (id) => {
    try {
      setLoading(true);
      const [detailRes, simRes, ratingsRes] = await Promise.all([
        getMovieDetails(id),
        getSimilarMovies(id),
        user ? getUserRatings() : Promise.resolve({ data: { ratings: [] } })
      ]);

      if (detailRes.data && detailRes.data.movie) {
        setMovie(detailRes.data.movie);
      }

      if (simRes.data && simRes.data.recommendations) {
        setSimilar(simRes.data.recommendations);
      }

      if (ratingsRes.data && ratingsRes.data.ratings) {
        const found = ratingsRes.data.ratings.find(r => Number(r.movieId) === Number(id));
        if (found) {
          setUserRating(found.rating);
        } else {
          setUserRating(0);
        }
      }
    } catch (err) {
      addToast('Failed to load movie details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (newRating) => {
    if (!user) {
      addToast('Please sign in to rate movies.', 'error');
      return;
    }
    try {
      setSubmittingRating(true);
      await submitRating(movieId, newRating);
      setUserRating(newRating);
      addToast(`Rated ${movie?.title || 'movie'} ${newRating} stars! AI recommendations updated.`, 'success');
      if (onRatingUpdated) onRatingUpdated();
    } catch (err) {
      addToast('Failed to submit rating.', 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  const isInWatchlist = user?.watchlist?.includes(movieId);

  if (!movieId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[var(--bg-panel)] border border-[var(--border-light)] rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors backdrop-blur-md border border-[var(--border-light)]"
          >
            <X className="w-5 h-5" />
          </button>

          {loading || !movie ? (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-[#F2B84B] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[var(--text-secondary)] font-medium">Loading cinematic metadata...</p>
            </div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {/* Hero Banner with Backdrop */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#181C26]">
                {movie.backdrop_path ? (
                  <img
                    src={movie.backdrop_path}
                    alt={movie.title}
                    className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#B3273A]/30 to-[#F2B84B]/30 flex items-center justify-center">
                    <Film className="w-20 h-20 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141A] via-[#11141A]/50 to-transparent" />

                {/* Hero Title Container */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end gap-6 z-10">
                  {/* Poster Thumbnail */}
                  <img
                    src={movie.poster_path || movie.backdrop_path}
                    alt={movie.title}
                    className="w-28 sm:w-36 aspect-[2/3] rounded-xl object-cover border-2 border-white/20 shadow-2xl shrink-0 hidden sm:block"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F2B84B] text-black flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-black" />
                        {movie.vote_average || '8.0'}
                      </span>
                      {movie.genres?.map((g, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs bg-white/10 text-[var(--text-primary)] border border-[var(--border-light)]">
                          {g}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display text-4xl sm:text-5xl tracking-wide text-white drop-shadow-md">
                      {movie.title}
                    </h2>
                    {movie.tagline && (
                      <p className="text-sm italic text-[#F2B84B]/90 mt-1">"{movie.tagline}"</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Meta Bar & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)]">
                  <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#F2B84B]" />
                      <span>{movie.release_date || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#F2B84B]" />
                      <span>{movie.runtime ? `${movie.runtime} min` : '120 min'}</span>
                    </div>
                  </div>

                  {/* Watchlist Toggle */}
                  <button
                    onClick={() => toggleUserWatchlist(movie.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                      isInWatchlist
                        ? 'bg-[#F2B84B] text-black shadow-[0_0_15px_rgba(242,184,75,0.4)]'
                        : 'bg-white/10 text-white border border-white/20 hover:border-[#F2B84B] hover:text-[#F2B84B]'
                    }`}
                  >
                    {isInWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    <span>{isInWatchlist ? 'In Your Watchlist' : 'Add to Watchlist'}</span>
                  </button>
                </div>

                {/* Rating Input Section */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-white/5 via-[#F2B84B]/5 to-white/5 border border-[#F2B84B]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display text-xl text-white tracking-wide">Rate This Movie</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Your ratings immediately train the KNN collaborative filtering algorithm.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RatingStars rating={userRating} onRate={handleRate} size="lg" />
                    {userRating > 0 && (
                      <span className="text-xs font-bold text-[#F2B84B] px-2.5 py-1 rounded-md bg-[#F2B84B]/10 border border-[#F2B84B]/30">
                        {userRating} / 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Overview */}
                <div>
                  <h3 className="font-display text-2xl tracking-wide text-white mb-2">Synopsis</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base font-normal">
                    {movie.overview}
                  </p>
                </div>

                {/* Cast Section */}
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h3 className="font-display text-2xl tracking-wide text-white mb-3">Top Cast</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {movie.cast.map((c, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[var(--bg-hover)] border border-white/5 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1E2330] flex items-center justify-center font-bold text-[#F2B84B] shrink-0 text-sm">
                            {c.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                            <p className="text-[11px] text-[var(--text-secondary)] truncate">{c.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* KNN "More Like This" Recommendations */}
                {similar && similar.length > 0 && (
                  <div className="pt-4 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-[#F2B84B]" />
                      <h3 className="font-display text-2xl tracking-wide text-white">More Like This (KNN Cosine Similarity)</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {similar.map((simMovie) => (
                        <div key={simMovie.id} onClick={() => loadMovieDetails(simMovie.id)}>
                          <MovieCard movie={simMovie} showScore={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
