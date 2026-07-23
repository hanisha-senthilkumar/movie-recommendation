import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, Check, Sparkles, Film, Play, Tv } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OTT_COLOR_MAP = {
  'Netflix': 'bg-red-600 text-white',
  'Prime Video': 'bg-sky-600 text-white',
  'Disney+ Hotstar': 'bg-indigo-600 text-white',
  'SonyLIV': 'bg-amber-600 text-white',
  'ZEE5': 'bg-purple-600 text-white',
  'JioHotstar': 'bg-pink-600 text-white'
};

export const MovieCard = ({ movie, onClick, showScore = false, reason = null }) => {
  const { user, toggleUserWatchlist } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isInWatchlist = user?.watchlist?.includes(movie.id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleUserWatchlist(movie.id);
  };

  const year = movie.release_date ? movie.release_date.split('-')[0] : (movie.release_year || '');
  const scorePercent = movie.score || movie.similarity_score 
    ? Math.round((movie.score || movie.similarity_score) * 100) 
    : null;

  const aiExplanation = reason || (scorePercent ? `High match based on your ${movie.genres?.[0] || 'cinema'} taste` : null);
  const posterUrl = useMemo(() => movie.poster_path || movie.backdrop_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80', [movie.poster_path, movie.backdrop_path]);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(movie)}
      className="glass-card group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full bg-[var(--bg-panel)]/90 border border-[var(--border-light)] shadow-lg hover:border-[#F2B84B]/50 transition-all duration-300"
    >
      {/* Poster Media Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#181C26]">
        {!imgError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          /* High Quality Fallback Poster Card */
          <div className="w-full h-full flex flex-col items-center justify-between p-5 bg-gradient-to-br from-[#1E2330] via-[#141822] to-[#0D1017] text-center border-b border-[var(--border-light)]">
            <div className="flex items-center justify-between w-full text-xs text-[var(--text-secondary)]">
              <span className="font-semibold text-[#F2B84B] uppercase tracking-wider">{movie.language || 'Cinema'}</span>
              <span>{year}</span>
            </div>

            <div className="my-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#F2B84B]/10 border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B] mx-auto shadow-inner">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl text-white font-bold tracking-wide leading-tight line-clamp-3">
                {movie.title}
              </h4>
              <p className="text-[11px] text-[var(--text-secondary)] font-normal italic">"{movie.director || 'CineMatch Feature'}"</p>
            </div>

            <div className="flex flex-wrap gap-1 justify-center w-full">
              {movie.genres?.slice(0, 2).map((g, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-[var(--text-primary)] border border-[var(--border-light)]">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skeleton Loading State */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/15 to-white/5 animate-pulse" />
        )}

        {/* Top Badges (Rating / Score & Language) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {showScore && scorePercent ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#B3273A] text-white shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F2B84B]" />
                {scorePercent}% Match
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/75 backdrop-blur-md text-[#F2B84B] border border-[#F2B84B]/40 flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#F2B84B]" />
                {movie.vote_average || '8.0'}
              </span>
            )}

            {movie.language && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-[var(--text-primary)] border border-white/20 uppercase tracking-wider">
                {movie.language}
              </span>
            )}
          </div>

          {/* Watchlist Action Button */}
          <button
            onClick={handleWatchlistClick}
            className={`p-2 rounded-full backdrop-blur-md border transition-all pointer-events-auto shadow-md ${
              isInWatchlist
                ? 'bg-[#F2B84B] text-black border-[#F2B84B] shadow-[0_0_12px_rgba(242,184,75,0.6)]'
                : 'bg-black/60 text-white border-white/20 hover:border-[#F2B84B] hover:text-[#F2B84B]'
            }`}
          >
            {isInWatchlist ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* AI Explanation Banner Badge */}
        {aiExplanation && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-[#F2B84B]/40 text-[10px] text-[#F2B84B] flex items-center gap-1.5 font-medium truncate shadow-lg">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate">Why: {aiExplanation}</span>
            </div>
          </div>
        )}

        {/* Hover Quick-Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <p className="text-xs text-[var(--text-secondary)] line-clamp-3 mb-3 font-normal leading-relaxed">
            {movie.overview || 'Click to view full cast, trailer, and detailed AI movie metadata.'}
          </p>
          
          {/* OTT Badges */}
          {movie.ott_providers && movie.ott_providers.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                <Tv className="w-3 h-3 text-[#F2B84B]" /> OTT:
              </span>
              {movie.ott_providers.slice(0, 2).map((ott, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${OTT_COLOR_MAP[ott] || 'bg-white/10 text-white'}`}
                >
                  {ott}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#F2B84B] font-semibold pt-1 border-t border-[var(--border-light)]">
            <span>View Details</span>
            <Play className="w-3.5 h-3.5 fill-[#F2B84B]" />
          </div>
        </div>
      </div>

      {/* Card Footer Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[var(--bg-panel)]">
        <div>
          <h3 className="font-display text-base tracking-wide text-white group-hover:text-[#F2B84B] transition-colors truncate font-semibold">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
            {year && <span>{year}</span>}
            {movie.director && (
              <>
                <span>•</span>
                <span className="truncate">{movie.director}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
