import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Film, ArrowRight, ShieldCheck, Cpu, Star } from 'lucide-react';
import { RotatingBackdrop } from '../components/RotatingBackdrop';
import { getTrendingMovies } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
    loadTrending();
  }, [isAuthenticated]);

  const loadTrending = async () => {
    try {
      const res = await getTrendingMovies();
      if (res.data && res.data.movies) {
        setTrending(res.data.movies.slice(0, 6));
      }
    } catch (e) {
      // Fallback handles this
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[var(--bg-page)]">
      {/* 10s Crossfading Rotating Backdrop */}
      <RotatingBackdrop intervalSeconds={10} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1 flex flex-col justify-center">
        
        {/* Hero Headline & Call-To-Actions */}
        <div className="max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#F2B84B]/30 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#F2B84B]" />
            <span className="text-xs font-semibold text-[#F2B84B] tracking-wide uppercase">
              Scikit-Learn KNN Collaborative Filtering
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-none"
          >
            YOUR NEXT CINEMATIC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2B84B] via-[#F8C668] to-[#B3273A]">
              OBSESSION AWAITS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl font-normal leading-relaxed"
          >
            Experience personalized film recommendations calculated with mathematical precision. Rate 3 movies to unlock customized collaborative filtering tailored to your unique taste.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={async () => {
                await guestLogin();
                navigate('/home');
              }}
              className="btn-amber px-8 py-4 rounded-full text-base flex items-center gap-3 shadow-xl group hover:scale-105 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-black" />
              <span>⚡ Try Movie Matcher Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full text-base font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Sign In to Your Vault
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="glass-panel p-6 rounded-2xl space-y-2 border border-[var(--border-light)]">
            <div className="w-10 h-10 rounded-xl bg-[#F2B84B]/10 border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display text-2xl text-white tracking-wide">Item-Based KNN Engine</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Cosine similarity matrix matches movie features and community rating vectors for tailored suggestions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-2 border border-[var(--border-light)]">
            <div className="w-10 h-10 rounded-xl bg-[#B3273A]/10 border border-[#B3273A]/30 flex items-center justify-center text-[#B3273A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-2xl text-white tracking-wide">Cold-Start Resilience</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              New user? Seamlessly fallback to curated trending lists until you submit 3 star ratings.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-2 border border-[var(--border-light)]">
            <div className="w-10 h-10 rounded-xl bg-[#F2B84B]/10 border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B]">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-display text-2xl text-white tracking-wide">TMDB Real Metadata</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              HD posters, backdrops, synopses, and cast profiles sourced directly from TMDB API.
            </p>
          </div>
        </motion.div>

        {/* Trending Preview Strip */}
        {trending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl tracking-wide text-white">Trending Preview</h3>
              <Link to="/register" className="text-xs font-semibold text-[#F2B84B] hover:underline">
                Explore Full Library →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {trending.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl overflow-hidden bg-[var(--bg-hover)] border border-[var(--border-light)] hover:border-[#F2B84B] transition-all group"
                >
                  <div className="aspect-[2/3] relative">
                    <img src={m.poster_path || m.backdrop_path} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-[#F2B84B] flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-[#F2B84B]" />
                      {m.vote_average}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
};
