import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Star, Bookmark, ShieldCheck, Film, Cpu } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getUserRatings } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const res = await getUserRatings();
      if (res.data && res.data.ratings) {
        setRatings(res.data.ratings);
      }
    } catch (e) {
      //
    }
  };

  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Profile Card Header */}
        <div className="glass-panel p-8 rounded-3xl border border-[var(--border-light)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#F2B84B]/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#B3273A] via-[#F2B84B] to-[#F8C668] p-1 shadow-2xl shrink-0">
              <div className="w-full h-full bg-[var(--bg-page)] rounded-xl flex items-center justify-center font-display text-4xl text-[#F2B84B]">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="font-display text-4xl text-white tracking-wide">{user?.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#F2B84B]" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F2B84B]" />
                  CineMatch Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-[var(--border-light)] text-center space-y-1">
            <Star className="w-6 h-6 text-[#F2B84B] mx-auto mb-1 fill-[#F2B84B]/20" />
            <div className="font-display text-4xl text-white">{ratings.length}</div>
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Movies Rated</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-[var(--border-light)] text-center space-y-1">
            <Bookmark className="w-6 h-6 text-[#F2B84B] mx-auto mb-1" />
            <div className="font-display text-4xl text-white">{user?.watchlist?.length || 0}</div>
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Watchlist Items</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-[var(--border-light)] text-center space-y-1">
            <Cpu className="w-6 h-6 text-[#F2B84B] mx-auto mb-1" />
            <div className="font-display text-4xl text-white">{avgRating} ★</div>
            <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">Average User Rating</p>
          </div>
        </div>

        {/* Model Status Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-white/5 via-[#F2B84B]/5 to-white/5 border border-[#F2B84B]/20 space-y-3">
          <div className="flex items-center gap-2 text-[#F2B84B]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-display text-xl text-white">KNN Recommendation Status</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {ratings.length >= 3 ? (
              <span className="text-emerald-400 font-semibold">
                ✓ Personalized AI Engine Active — Your profile contains {ratings.length} ratings which drive custom collaborative filtering.
              </span>
            ) : (
              <span className="text-[#F2B84B]">
                ! Cold-Start Status — Rate at least 3 movies (currently {ratings.length}/3) to activate personalized KNN recommendations.
              </span>
            )}
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
};
