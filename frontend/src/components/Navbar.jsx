import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Bookmark, User as UserIcon, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onSearch, onOpenWizard }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cinematch-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cinematch-theme', 'light');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    if (location.pathname !== '/home') {
      navigate('/home');
    }
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-light)] bg-[var(--bg-page)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B3273A] via-[#F2B84B] to-[#F8C668] p-0.5 shadow-[0_0_20px_rgba(242,184,75,0.3)] group-hover:shadow-[0_0_30px_rgba(242,184,75,0.6)] transition-all duration-300">
            <div className="w-full h-full bg-[var(--bg-page)] rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-[#F2B84B] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl tracking-widest text-white group-hover:text-[#F2B84B] transition-colors leading-none">
              CINE<span className="text-[#F2B84B]">MATCH</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--text-secondary)] font-medium">
              AI Recommendation Engine
            </span>
          </div>
        </Link>

        {/* Live Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search movies, genres, actors..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[var(--bg-hover)] border border-[var(--border-light)] text-sm text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-[#F2B84B]/60 focus:ring-1 focus:ring-[#F2B84B]/40 transition-all"
            />
          </div>
        </form>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/home"
                onClick={() => {
                  setQuery('');
                  if (onSearch) onSearch('');
                  if (location.pathname === '/home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/home' ? 'text-[#F2B84B] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Discover</span>
              </Link>

              <Link
                to="/watchlist"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/watchlist' ? 'text-[#F2B84B] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Watchlist</span>
                {user?.watchlist?.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[#B3273A] text-white font-bold">
                    {user.watchlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/profile' ? 'text-[#F2B84B] bg-[var(--bg-hover)]' : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>

              {onOpenWizard && (
                <button
                  onClick={() => onOpenWizard('preferences')}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F2B84B]/10 border border-[#F2B84B]/30 text-xs font-semibold text-[#F2B84B] hover:bg-[#F2B84B]/20 transition-all shadow-[0_0_10px_rgba(242,184,75,0.15)]"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-[#F2B84B]" />
                  <span>Preference Quiz</span>
                </button>
              )}

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 text-[var(--text-secondary)] hover:text-[#F2B84B] hover:bg-[#F2B84B]/10 rounded-lg transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                title="Toggle Theme"
                className="p-2 text-[var(--text-secondary)] hover:text-[#F2B84B] hover:bg-[#F2B84B]/10 rounded-lg transition-colors mr-2"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-white px-3.5 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-amber px-5 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
