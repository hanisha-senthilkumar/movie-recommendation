import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Star, Search, CheckCircle2, ArrowRight, RefreshCw, 
  Sliders, Film, Heart, Zap, Flame, Bookmark, Info, Compass, Shield
} from 'lucide-react';
import { RatingStars } from './RatingStars';
import { MovieCard } from './MovieCard';
import { 
  getPopularMovies, searchMovies, submitRating, getUserRecommendations, 
  getCustomInputRecommendations, toggleWatchlist 
} from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const RecommendationWizard = ({ isOpen, onClose, onComplete, initialTab = 'preferences' }) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(initialTab); // 'preferences' | 'ratings'
  const [step, setStep] = useState(1); // 1: Questions/Inputs, 2: Generating, 3: Results
  
  // Preference Questionnaire State
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [promptQuery, setPromptQuery] = useState('');
  
  // Rating-based KNN State
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [userInputs, setUserInputs] = useState({}); // { movieId: rating }
  const [selectedMoviesMeta, setSelectedMoviesMeta] = useState({});
  
  // Results & Loading State
  const [recommendations, setRecommendations] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [watchlistMap, setWatchlistMap] = useState({});

  const GENRES_LIST = [
    { id: 'Action', label: 'Action', icon: '⚡' },
    { id: 'Sci-Fi', label: 'Sci-Fi', icon: '🚀' },
    { id: 'Adventure', label: 'Adventure', icon: '🗺️' },
    { id: 'Drama', label: 'Drama', icon: '🎭' },
    { id: 'Crime', label: 'Crime', icon: '🔍' },
    { id: 'Comedy', label: 'Comedy', icon: '😂' },
    { id: 'Animation', label: 'Animation', icon: '🎨' },
    { id: 'Thriller', label: 'Thriller', icon: '😱' },
    { id: 'Horror', label: 'Horror', icon: '👻' },
    { id: 'Fantasy', label: 'Fantasy', icon: '🔮' },
    { id: 'Romance', label: 'Romance', icon: '💖' },
    { id: 'Mystery', label: 'Mystery', icon: '🕵️' }
  ];

  const MOODS_LIST = [
    { id: 'Mind-bending', label: 'Mind-Bending & Twist', desc: 'Complex plots, reality-bending, deep mysteries', icon: '🤯' },
    { id: 'Adrenaline Rush', label: 'High Adrenaline', desc: 'Non-stop action, explosive chases, high stakes', icon: '🔥' },
    { id: 'Dark & Gritty', label: 'Dark & Gritty Noir', desc: 'Atmospheric crime, moral ambiguity, intense drama', icon: '🌙' },
    { id: 'Feel-Good', label: 'Heartwarming & Fun', desc: 'Uplifting stories, laughter, inspiring journeys', icon: '✨' },
    { id: 'Thought-provoking', label: 'Thought-Provoking', desc: 'Philosophical, historical, emotional depth', icon: '💡' },
    { id: 'Romantic', label: 'Romantic & Passionate', desc: 'Love stories, emotional connection, heartwarming', icon: '❤️' }
  ];

  const ERAS_LIST = [
    { id: 'Modern Hits (2015+)', label: 'Modern Hits (2015 - Present)' },
    { id: '2000s - 2010s', label: '2000s - 2010s Classics' },
    { id: '80s & 90s', label: '80s & 90s Cult Favorites' },
    { id: 'Pre-1980', label: 'Vintage Golden Age (Pre-1980)' },
    { id: '', label: 'Any Era / All Time' }
  ];

  const RATING_THRESHOLDS = [
    { value: 0, label: 'Any Rating' },
    { value: 7.0, label: '7.0+ IMDb' },
    { value: 8.0, label: '8.0+ IMDb' },
    { value: 8.5, label: '8.5+ Masterpiece' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user && user.watchlist) {
      const map = {};
      user.watchlist.forEach(item => {
        const id = typeof item === 'object' ? item.movieId || item.id : item;
        map[id] = true;
      });
      setWatchlistMap(map);
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const res = await getPopularMovies();
      if (res.data && res.data.movies) {
        setPopularMovies(res.data.movies);
      }
    } catch (err) {
      addToast('Failed to load movie options.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) ? prev.filter(g => g !== genreId) : [...prev, genreId]
    );
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await searchMovies(query);
      if (res.data && res.data.movies) {
        setSearchResults(res.data.movies);
      }
    } catch (e) {
      //
    }
  };

  const handleRateMovie = (movie, rating) => {
    setUserInputs(prev => ({ ...prev, [movie.id]: rating }));
    setSelectedMoviesMeta(prev => ({ ...prev, [movie.id]: movie }));
  };

  const handleRemoveInput = (movieId) => {
    setUserInputs(prev => {
      const updated = { ...prev };
      delete updated[movieId];
      return updated;
    });
    setSelectedMoviesMeta(prev => {
      const updated = { ...prev };
      delete updated[movieId];
      return updated;
    });
  };

  // Generate Recommendations based on Preferences OR KNN Ratings
  const handleGenerateRecommendations = async () => {
    try {
      setSubmitting(true);
      setStep(2); // Generating animation

      let recs = [];
      let total = 0;

      if (activeTab === 'preferences') {
        // Preference Questionnaire mode
        const payload = {
          genres: selectedGenres,
          mood: selectedMood,
          era: selectedEra,
          minRating: minRating,
          promptQuery: promptQuery,
          topN: 12
        };

        const res = await getCustomInputRecommendations(payload);
        if (res.data && res.data.recommendations) {
          recs = res.data.recommendations;
          total = res.data.total_matches || recs.length;
        }
      } else {
        // KNN Rating training mode
        const ratingPromises = Object.entries(userInputs).map(([mId, r]) =>
          submitRating(Number(mId), r)
        );
        await Promise.all(ratingPromises);

        const recRes = await getUserRecommendations();
        if (recRes.data && recRes.data.recommendations) {
          recs = recRes.data.recommendations;
          total = recs.length;
        }
      }

      setRecommendations(recs);
      setTotalMatches(total);
      setStep(3); // Results step
      addToast(
        activeTab === 'preferences' 
          ? 'Matched movie recommendations based on your preferences!'
          : 'Successfully trained KNN engine with your ratings!', 
        'success'
      );
    } catch (err) {
      console.error(err);
      addToast('Failed to calculate recommendations. Please try again.', 'error');
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleWatchlist = async (movieId) => {
    try {
      await toggleWatchlist(movieId);
      setWatchlistMap(prev => ({
        ...prev,
        [movieId]: !prev[movieId]
      }));
      addToast(
        watchlistMap[movieId] ? 'Removed from Watchlist' : 'Added to Watchlist!',
        'info'
      );
    } catch (err) {
      addToast('Failed to update watchlist.', 'error');
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedGenres([]);
    setSelectedMood('');
    setSelectedEra('');
    setMinRating(0);
    setPromptQuery('');
    setUserInputs({});
    setRecommendations([]);
  };

  if (!isOpen) return null;

  const displayList = searchResults !== null ? searchResults : popularMovies;
  const ratedCount = Object.keys(userInputs).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-lg"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl bg-[var(--bg-panel)] border border-[var(--border-light)] rounded-3xl overflow-hidden shadow-2xl z-10 my-6 max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-[var(--border-light)] bg-[#151922] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B3273A] via-[#F2B84B] to-[#F8C668] p-0.5 shadow-[0_0_15px_rgba(242,184,75,0.3)]">
                <div className="w-full h-full bg-[var(--bg-page)] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#F2B84B]" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-2xl tracking-wide text-white flex items-center gap-2">
                  AI RECOMMENDATION ENGINE
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {activeTab === 'preferences' 
                    ? 'Select your preferences to get instant tailored recommendations'
                    : 'Rate movies to train scikit-learn KNN Cosine Similarity matrix'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Tab Selector */}
              {step === 1 && (
                <div className="flex rounded-xl bg-[var(--bg-hover)] p-1 border border-[var(--border-light)] text-xs">
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeTab === 'preferences'
                        ? 'bg-[#F2B84B] text-black shadow'
                        : 'text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    🎯 Preference Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('ratings')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeTab === 'ratings'
                        ? 'bg-[#F2B84B] text-black shadow'
                        : 'text-[var(--text-secondary)] hover:text-white'
                    }`}
                  >
                    ⭐ Rate Movies (KNN)
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* STEP 1: PREFERENCE QUESTIONNAIRE TAB */}
          {step === 1 && activeTab === 'preferences' && (
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-8">
              
              {/* 1. Genre Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-[#F2B84B]/20 text-[#F2B84B] flex items-center justify-center text-xs">1</span>
                  Select Preferred Genres
                  <span className="text-xs text-[var(--text-secondary)] font-normal ml-auto">
                    {selectedGenres.length} selected
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {GENRES_LIST.map((g) => {
                    const isSelected = selectedGenres.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGenre(g.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'border-[#F2B84B] bg-[#F2B84B]/15 text-white shadow-[0_0_15px_rgba(242,184,75,0.2)]'
                            : 'border-[var(--border-light)] bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{g.icon}</span>
                        <span className="text-xs font-semibold">{g.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F2B84B] ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Mood & Vibe */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-[#F2B84B]/20 text-[#F2B84B] flex items-center justify-center text-xs">2</span>
                  What Vibe or Mood are you in?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {MOODS_LIST.map((m) => {
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMood(isSelected ? '' : m.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#F2B84B] bg-[#F2B84B]/15 shadow-[0_0_15px_rgba(242,184,75,0.2)]'
                            : 'border-[var(--border-light)] bg-[var(--bg-hover)] hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{m.icon}</span>
                          <span className="text-xs font-bold text-white">{m.label}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Era & Minimum Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Era */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-[#F2B84B]/20 text-[#F2B84B] flex items-center justify-center text-xs">3</span>
                    Preferred Release Era
                  </label>
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-[var(--border-light)] text-xs text-white focus:outline-none focus:border-[#F2B84B]"
                  >
                    {ERAS_LIST.map(e => (
                      <option key={e.id} value={e.id} className="bg-[var(--bg-panel)] text-white">
                        {e.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Rating */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-6 h-6 rounded-full bg-[#F2B84B]/20 text-[#F2B84B] flex items-center justify-center text-xs">4</span>
                    Minimum TMDB Rating
                  </label>
                  <div className="flex gap-2">
                    {RATING_THRESHOLDS.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setMinRating(r.value)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          minRating === r.value
                            ? 'border-[#F2B84B] bg-[#F2B84B] text-black font-bold'
                            : 'border-[var(--border-light)] bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:border-white/20'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* 4. Natural Language Prompt / Keywords */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-[#F2B84B]/20 text-[#F2B84B] flex items-center justify-center text-xs">5</span>
                  Keyword or Story Prompt (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value={promptQuery}
                    onChange={(e) => setPromptQuery(e.target.value)}
                    placeholder="e.g. Space voyage with plot twists, dystopian cyberpunk, feel good heist..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-[var(--border-light)] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F2B84B]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 1: KNN RATINGS INPUT TAB */}
          {step === 1 && activeTab === 'ratings' && (
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-light)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F2B84B]/20 text-[#F2B84B] flex items-center justify-center font-bold text-sm">
                    {ratedCount}/3
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Rate 3 or more movies you've watched</h4>
                    <p className="text-xs text-[var(--text-secondary)]">The KNN model will compute Cosine Distances against catalog vectors.</p>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search any movie..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-[var(--border-light)] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F2B84B]"
                  />
                </div>
              </div>

              {/* Selected Inputs Tray */}
              {ratedCount > 0 && (
                <div className="p-4 rounded-2xl bg-[#F2B84B]/5 border border-[#F2B84B]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F2B84B] uppercase tracking-wider">
                      Your Input Movies ({ratedCount})
                    </span>
                    {ratedCount >= 3 && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for AI matrix calculation!
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userInputs).map(([mId, rating]) => {
                      const meta = selectedMoviesMeta[mId];
                      return (
                        <div
                          key={mId}
                          className="px-3 py-1.5 rounded-xl bg-[#1A1F2C] border border-[#F2B84B]/30 flex items-center gap-2 text-xs"
                        >
                          <span className="font-semibold text-white max-w-[120px] truncate">
                            {meta?.title || `Movie ${mId}`}
                          </span>
                          <span className="text-[#F2B84B] font-bold">★ {rating}</span>
                          <button
                            onClick={() => handleRemoveInput(mId)}
                            className="text-[var(--text-secondary)] hover:text-rose-400 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Movie Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayList.map((movie) => {
                  const currentRating = userInputs[movie.id] || 0;
                  return (
                    <div
                      key={movie.id}
                      className={`p-3 rounded-2xl bg-[var(--bg-hover)] border transition-all flex flex-col justify-between ${
                        currentRating > 0
                          ? 'border-[#F2B84B] bg-[#F2B84B]/10 shadow-[0_0_15px_rgba(242,184,75,0.15)]'
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-black/40">
                        <img
                          src={movie.poster_path || movie.backdrop_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                        {currentRating > 0 && (
                          <div className="absolute top-2 right-2 bg-[#F2B84B] text-black font-bold text-xs px-2 py-0.5 rounded-md shadow">
                            ★ {currentRating}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-white truncate" title={movie.title}>
                          {movie.title}
                        </h5>

                        <div className="flex items-center justify-center py-1">
                          <RatingStars
                            rating={currentRating}
                            onRate={(r) => handleRateMovie(movie, r)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* STEP 2: GENERATING ANIMATION */}
          {step === 2 && (
            <div className="p-16 flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#F2B84B] border-t-transparent rounded-full animate-spin" />
                <Sparkles className="w-8 h-8 text-[#F2B84B] absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-3xl text-white tracking-wide">
                  CALCULATING RECOMMENDATIONS...
                </h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  {activeTab === 'preferences'
                    ? 'Matching genres, mood weights, era boundaries, and rating thresholds.'
                    : 'Fitting Scikit-Learn Cosine Similarity matrix against user ratings.'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS DISPLAY */}
          {step === 3 && (
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4">
                <div>
                  <h4 className="font-display text-3xl text-white tracking-wide flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#F2B84B]" />
                    YOUR TAILORED MOVIE RECOMMENDATIONS
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Found {totalMatches} matching movies according to your preferences
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-xs text-[var(--text-secondary)] hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#F2B84B]" />
                  Modify Preferences
                </button>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {recommendations.map((m) => {
                    const movieObj = m.movie || m;
                    const matchPct = m.match_percentage || (m.score ? Math.round(m.score * 100) : 90);
                    const tags = m.match_tags || movieObj.genres?.slice(0, 2) || [];
                    const isWatchlisted = watchlistMap[movieObj.id];

                    return (
                      <div
                        key={movieObj.id}
                        className="bg-[#151922] border border-[var(--border-light)] rounded-2xl overflow-hidden hover:border-[#F2B84B]/50 transition-all group flex flex-col"
                      >
                        {/* Poster Header */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-black/50">
                          <img
                            src={movieObj.poster_path || movieObj.backdrop_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'}
                            alt={movieObj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              if (movieObj.poster_path && e.target.src !== movieObj.poster_path) {
                                e.target.src = movieObj.poster_path;
                              } else {
                                e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-transparent to-black/40" />

                          {/* Match Badge */}
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#F2B84B] text-black font-bold text-xs shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3 fill-black" />
                            <span>{matchPct}% Match</span>
                          </div>

                          {/* Watchlist Toggle */}
                          <button
                            onClick={() => handleToggleWatchlist(movieObj.id)}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                              isWatchlisted
                                ? 'bg-[#B3273A] text-white'
                                : 'bg-black/60 text-[var(--text-secondary)] hover:text-white hover:bg-black/80'
                            }`}
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        {/* Details Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="font-semibold text-sm text-white truncate" title={movieObj.title}>
                                {movieObj.title}
                              </h5>
                              <span className="text-xs font-bold text-[#F2B84B] flex items-center gap-1 shrink-0">
                                ★ {movieObj.vote_average ? movieObj.vote_average.toFixed(1) : '8.0'}
                              </span>
                            </div>

                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-3">
                              {movieObj.overview || 'No overview available.'}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-[var(--bg-hover)] border border-[var(--border-light)] text-[10px] text-[var(--text-secondary)] font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-[var(--text-secondary)] space-y-3">
                  <p className="text-sm">No recommendations matched your exact filter combination.</p>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl bg-[#F2B84B] text-black font-semibold text-xs"
                  >
                    Adjust Filters & Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="p-4 sm:p-6 border-t border-[var(--border-light)] bg-[#151922] flex items-center justify-between">
            {step === 1 && (
              <>
                <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
                  {activeTab === 'preferences'
                    ? 'Select your favorite genres & mood for custom AI matching'
                    : `Need at least 3 rated inputs (${ratedCount}/3 selected)`}
                </p>
                <button
                  onClick={handleGenerateRecommendations}
                  disabled={activeTab === 'ratings' && ratedCount < 3}
                  className={`ml-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                    activeTab === 'preferences' || ratedCount >= 3
                      ? 'bg-gradient-to-r from-[#F2B84B] to-[#F8C668] text-black shadow-[0_0_20px_rgba(242,184,75,0.4)] hover:scale-105'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Get Movie Recommendations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 3 && (
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] text-xs hover:text-white"
                >
                  Start Over
                </button>
                <button
                  onClick={() => {
                    if (onComplete) onComplete();
                    onClose();
                  }}
                  className="px-8 py-3 rounded-xl bg-[#F2B84B] text-black font-bold text-sm shadow-[0_0_20px_rgba(242,184,75,0.4)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Done / Apply to Dashboard</span>
                </button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
