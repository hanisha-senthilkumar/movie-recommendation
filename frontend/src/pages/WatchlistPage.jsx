import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star, Film, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MovieGrid } from '../components/MovieGrid';
import { MovieModal } from '../components/MovieModal';
import { getWatchlist, getUserRatings, getMovieDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const WatchlistPage = () => {
  const { user } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist' | 'rated'
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user?.watchlist]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [wlRes, ratingsRes] = await Promise.all([
        getWatchlist(),
        getUserRatings()
      ]);

      if (wlRes.data && wlRes.data.watchlist) {
        setWatchlistMovies(wlRes.data.watchlist);
      }

      if (ratingsRes.data && ratingsRes.data.ratings) {
        const ratedDetails = await Promise.all(
          ratingsRes.data.ratings.map(async (r) => {
            const m = await getMovieDetails(r.movieId);
            return m.data?.movie ? { ...m.data.movie, userRating: r.rating } : null;
          })
        );
        setRatedMovies(ratedDetails.filter(Boolean));
      }
    } catch (err) {
      console.error('Failed to load watchlist/ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedMovies = activeTab === 'watchlist' ? watchlistMovies : ratedMovies;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-light)] pb-6">
          <div>
            <h1 className="font-display text-5xl tracking-wide text-white flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[#F2B84B]" />
              MY CINEMA VAULT
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage your saved watchlist and review your historical ratings.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[var(--bg-hover)] border border-[var(--border-light)]">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-[#F2B84B] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Watchlist ({watchlistMovies.length})
            </button>
            <button
              onClick={() => setActiveTab('rated')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'rated'
                  ? 'bg-[#F2B84B] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Rated Movies ({ratedMovies.length})
            </button>
          </div>
        </div>

        {/* Content Display */}
        {loading ? (
          <MovieGrid movies={[]} loading={true} />
        ) : displayedMovies.length > 0 ? (
          <MovieGrid
            movies={displayedMovies}
            loading={false}
            onMovieClick={(m) => setSelectedMovieId(m.id)}
          />
        ) : (
          /* Cinematic Empty State Illustration */
          <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto my-12 border border-[var(--border-light)] flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B3273A]/20 via-[#F2B84B]/20 to-transparent border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B] shadow-2xl">
              <Film className="w-10 h-10" />
            </div>
            <h3 className="font-display text-3xl text-white">
              {activeTab === 'watchlist' ? 'Your Watchlist is Empty' : 'No Ratings Recorded Yet'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm">
              {activeTab === 'watchlist'
                ? 'Explore trending movies and click the bookmark icon to save titles for later.'
                : 'Rate at least 3 movies to train your personalized KNN AI recommendation model.'}
            </p>
            <Link
              to="/home"
              className="btn-amber px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 mt-2"
            >
              <span>Explore Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </main>

      <Footer />

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onRatingUpdated={loadData}
        />
      )}
    </div>
  );
};
