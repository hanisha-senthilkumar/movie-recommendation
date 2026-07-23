import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Film, Search, Filter, Info, Globe, Smile, Zap, Award, Compass, Heart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MovieGrid } from '../components/MovieGrid';
import { MovieModal } from '../components/MovieModal';
import { RecommendationWizard } from '../components/RecommendationWizard';
import { 
  getUserRecommendations, 
  getTrendingMovies, 
  getPopularMovies, 
  searchMovies,
  getMoviesByMood
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const MOODS = [
  { id: 'Happy', emoji: '😊', label: 'Happy' },
  { id: 'Comedy', emoji: '😂', label: 'Comedy' },
  { id: 'Romantic', emoji: '❤️', label: 'Romantic' },
  { id: 'Sad', emoji: '😢', label: 'Sad' },
  { id: 'Horror', emoji: '😱', label: 'Horror' },
  { id: 'Action', emoji: '🔥', label: 'Action' },
  { id: 'Mind-bending', emoji: '🧠', label: 'Mind-Bending' },
  { id: 'Family', emoji: '👨‍👩‍👧', label: 'Family' },
  { id: 'Feel Good', emoji: '💖', label: 'Feel Good' },
  { id: 'Emotional', emoji: '🎭', label: 'Emotional' },
  { id: 'Crime', emoji: '🎬', label: 'Crime' },
  { id: 'Mystery', emoji: '🕵️', label: 'Mystery' }
];

const LANGUAGES = ['All', 'Tamil', 'Malayalam', 'Telugu', 'Hindi', 'English', 'Korean', 'Japanese'];
const GENRES = ['All', 'Action', 'Thriller', 'Drama', 'Crime', 'Comedy', 'Adventure', 'Sci-Fi', 'Romance', 'Mystery', 'Animation'];

export const HomePage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [trendingTamil, setTrendingTamil] = useState([]);
  const [trendingMalayalam, setTrendingMalayalam] = useState([]);
  const [trendingHindi, setTrendingHindi] = useState([]);
  const [moodMovies, setMoodMovies] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardTab, setWizardTab] = useState('preferences');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const openWizard = (tab = 'preferences') => {
    setWizardTab(tab);
    setIsWizardOpen(true);
  };
  const [coldStartInfo, setColdStartInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [selectedLanguage]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [recRes, trendRes, popRes, tamilRes, malRes, hindiRes] = await Promise.all([
        getUserRecommendations(),
        getTrendingMovies(selectedLanguage),
        getPopularMovies(),
        getTrendingMovies('Tamil'),
        getTrendingMovies('Malayalam'),
        getTrendingMovies('Hindi')
      ]);

      if (recRes.data) {
        setRecommendations(recRes.data.recommendations || []);
        if (recRes.data.cold_start) {
          setColdStartInfo(recRes.data.reason || 'Rate 3+ movies to enable personalized AI recommendations.');
        } else {
          setColdStartInfo(null);
        }
      }

      if (trendRes.data && trendRes.data.movies) {
        setTrending(trendRes.data.movies);
      }

      if (popRes.data && popRes.data.movies) {
        setPopular(popRes.data.movies);
      }

      if (tamilRes.data && tamilRes.data.movies) {
        setTrendingTamil(tamilRes.data.movies);
      }

      if (malRes.data && malRes.data.movies) {
        setTrendingMalayalam(malRes.data.movies);
      }

      if (hindiRes.data && hindiRes.data.movies) {
        setTrendingHindi(hindiRes.data.movies);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await searchMovies(query, selectedLanguage);
      if (res.data && res.data.movies) {
        setSearchResults(res.data.movies);
      }
    } catch (err) {
      //
    }
  };

  const handleMoodSelect = async (moodId) => {
    if (selectedMood === moodId) {
      setSelectedMood(null);
      setMoodMovies([]);
      return;
    }
    setSelectedMood(moodId);
    try {
      const res = await getMoviesByMood(moodId);
      if (res.data && res.data.movies) {
        setMoodMovies(res.data.movies);
      }
    } catch (e) {
      //
    }
  };

  const filterByGenreAndLang = (list) => {
    if (!list) return [];
    let result = list;
    if (selectedGenre !== 'All') {
      result = result.filter(m => m.genres && m.genres.includes(selectedGenre));
    }
    if (selectedLanguage !== 'All') {
      result = result.filter(m => m.language && m.language.toLowerCase() === selectedLanguage.toLowerCase());
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between">
      <Navbar onSearch={handleSearch} onOpenWizard={openWizard} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        
        {/* Language Filter & Genre Filter Bar */}
        <div className="space-y-3 bg-[var(--bg-panel)]/80 p-4 rounded-2xl border border-[var(--border-light)] backdrop-blur-md">
          {/* Languages */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
              <Globe className="w-3.5 h-3.5 text-[#F2B84B]" /> Language:
            </span>
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedLanguage === lang
                    ? 'bg-gradient-to-r from-[#F2B84B] to-[#F8C668] text-black shadow-[0_0_12px_rgba(242,184,75,0.4)]'
                    : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-light)] hover:border-white/30'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Genres */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 border-t border-white/5">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#B3273A]" /> Genre:
            </span>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === g
                    ? 'bg-[#B3273A] text-white shadow-[0_0_12px_rgba(179,39,58,0.4)]'
                    : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-light)] hover:border-white/30'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Interactive Recommendation Input Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151922] via-[#1A1F2C] to-[#0E1117] border border-[var(--border-light)] p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2B84B]/10 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B84B]/10 border border-[#F2B84B]/30 text-xs font-semibold text-[#F2B84B]">
                <Sparkles className="w-3.5 h-3.5" /> AI Movie Preference & Mood Engine
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wide leading-tight font-bold">
                CINEMATCH AI RECOMMENDATION PLATFORM
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Explore thousands of movies across Tamil, Malayalam, Telugu, Hindi, Korean, Japanese, and English. Filter by mood, genres, ratings, or custom text prompts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => openWizard('preferences')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F2B84B] to-[#F8C668] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(242,184,75,0.4)] hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Input Movie Tastes</span>
              </button>

              <button
                onClick={() => openWizard('ratings')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 border border-[var(--border-light)] text-[var(--text-primary)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all whitespace-nowrap cursor-pointer"
              >
                <span>⭐ Rate Movies Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mood Recommendation Section */}
        <section className="space-y-4 bg-[var(--bg-panel)]/60 p-6 rounded-3xl border border-[var(--border-light)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-2xl tracking-wide text-white font-bold">MOOD BASED RECOMMENDATIONS</h3>
                <p className="text-xs text-[var(--text-secondary)]">Select how you want to feel right now</p>
              </div>
            </div>

            {selectedMood && (
              <button
                onClick={() => handleMoodSelect(selectedMood)}
                className="text-xs text-[#F2B84B] hover:underline"
              >
                Clear Mood
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                  selectedMood === m.id
                    ? 'bg-[#F2B84B] text-black border-[#F2B84B] shadow-[0_0_15px_rgba(242,184,75,0.5)] font-bold scale-105'
                    : 'bg-[var(--bg-hover)] text-[var(--text-primary)] border-[var(--border-light)] hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <span className="text-base">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && moodMovies.length > 0 && (
            <div className="pt-4 border-t border-[var(--border-light)] space-y-4">
              <h4 className="text-sm font-bold text-[#F2B84B] flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Recommended for "{selectedMood}" Mood ({moodMovies.length} movies)
              </h4>
              <MovieGrid
                movies={filterByGenreAndLang(moodMovies)}
                loading={false}
                onMovieClick={(m) => setSelectedMovieId(m.id)}
              />
            </div>
          )}
        </section>

        {/* Live Search Results View */}
        {searchResults !== null ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4">
              <h2 className="font-display text-3xl tracking-wide text-white flex items-center gap-2 font-bold">
                <Search className="w-6 h-6 text-[#F2B84B]" />
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={() => setSearchResults(null)}
                className="text-xs text-[#F2B84B] hover:underline"
              >
                Clear Search
              </button>
            </div>
            <MovieGrid
              movies={filterByGenreAndLang(searchResults)}
              loading={false}
              onMovieClick={(m) => setSelectedMovieId(m.id)}
            />
          </section>
        ) : (
          <>
            {/* ROW 1: Recommended For You (KNN Collaborative Filtering) */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-light)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F2B84B]/10 border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl tracking-wide text-white leading-none font-bold">
                      RECOMMENDED FOR YOU
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Calculated with Cosine Similarity & Preference Filters
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => openWizard('preferences')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F2B84B] to-[#F8C668] text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(242,184,75,0.3)] hover:scale-105 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>🎯 Preference Quiz</span>
                  </button>

                  <button
                    onClick={() => openWizard('ratings')}
                    className="px-3.5 py-2 rounded-xl bg-white/10 border border-[var(--border-light)] text-[var(--text-primary)] font-medium text-xs flex items-center gap-1.5 hover:bg-white/15 transition-all cursor-pointer"
                  >
                    <span>⭐ Rate Movies</span>
                  </button>

                  {coldStartInfo && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F2B84B]/10 border border-[#F2B84B]/30 text-xs text-[#F2B84B]">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>{coldStartInfo}</span>
                    </div>
                  )}
                </div>
              </div>

              <MovieGrid
                movies={filterByGenreAndLang(recommendations)}
                loading={loading}
                showScore={!coldStartInfo}
                onMovieClick={(m) => setSelectedMovieId(m.id)}
              />
            </section>

            {/* ROW 2: Trending Tamil Cinema */}
            {trendingTamil.length > 0 && (
              <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F2B84B]/10 border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-3xl tracking-wide text-white leading-none font-bold">
                        TRENDING TAMIL CINEMA
                      </h2>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Vikram, Leo, Jailer, Ratsasan, Master & more
                      </span>
                    </div>
                  </div>
                </div>

                <MovieGrid
                  movies={filterByGenreAndLang(trendingTamil)}
                  loading={loading}
                  onMovieClick={(m) => setSelectedMovieId(m.id)}
                />
              </section>
            )}

            {/* ROW 3: Trending Malayalam Cinema */}
            {trendingMalayalam.length > 0 && (
              <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-3xl tracking-wide text-white leading-none font-bold">
                        TRENDING MALAYALAM CINEMA
                      </h2>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Drishyam, Manjummel Boys, Premam, Kumbalangi Nights & more
                      </span>
                    </div>
                  </div>
                </div>

                <MovieGrid
                  movies={filterByGenreAndLang(trendingMalayalam)}
                  loading={loading}
                  onMovieClick={(m) => setSelectedMovieId(m.id)}
                />
              </section>
            )}

            {/* ROW 3.5: Trending Hindi Cinema */}
            {trendingHindi.length > 0 && (
              <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-3xl tracking-wide text-white leading-none font-bold">
                        TRENDING HINDI CINEMA
                      </h2>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Dangal, 3 Idiots, Lagaan, Sholay & more
                      </span>
                    </div>
                  </div>
                </div>

                <MovieGrid
                  movies={filterByGenreAndLang(trendingHindi)}
                  loading={loading}
                  onMovieClick={(m) => setSelectedMovieId(m.id)}
                />
              </section>
            )}

            {/* ROW 4: Global Trending & Blockbusters */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-2.5 border-b border-[var(--border-light)] pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#B3273A]/10 border border-[#B3273A]/30 flex items-center justify-center text-[#B3273A]">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-3xl tracking-wide text-white leading-none font-bold">
                    GLOBAL BLOCKBUSTERS & TRENDING
                  </h2>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Hollywood, Korean, Japanese & Indian Masterpieces
                  </span>
                </div>
              </div>

              <MovieGrid
                movies={filterByGenreAndLang(trending)}
                loading={loading}
                onMovieClick={(m) => setSelectedMovieId(m.id)}
              />
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Detail Modal */}
      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onRatingUpdated={loadHomeData}
        />
      )}

      {/* AI Input Recommendation Wizard Modal */}
      <RecommendationWizard
        isOpen={isWizardOpen}
        initialTab={wizardTab}
        onClose={() => setIsWizardOpen(false)}
        onComplete={loadHomeData}
      />
    </div>
  );
};
