import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, logoutUser, toggleWatchlist as toggleWatchlistApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      if (res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      if (res.data.token) localStorage.setItem('cinematch_token', res.data.token);
      setUser(res.data.user);
      addToast(`Welcome back, ${res.data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerUser({ name, email, password });
      if (res.data.token) localStorage.setItem('cinematch_token', res.data.token);
      setUser(res.data.user);
      addToast(`Account created! Welcome to CineMatch, ${res.data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const guestLogin = async () => {
    try {
      const guestEmail = `cine_guest_${Math.floor(1000 + Math.random() * 9000)}@cinematch.demo`;
      const res = await register('Guest Cinephile', guestEmail, 'CinematchPass123!');
      return res;
    } catch (err) {
      return { success: false, message: 'Failed to create guest session.' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) { /* no-op */ }
    localStorage.removeItem('cinematch_token');
    setUser(null);
    addToast('Signed out successfully.', 'info');
  };

  const toggleUserWatchlist = async (movieId) => {
    if (!user) {
      addToast('Please sign in to add movies to your watchlist.', 'error');
      return false;
    }
    try {
      const res = await toggleWatchlistApi(movieId);
      setUser(prev => ({
        ...prev,
        watchlist: res.data.watchlist || []
      }));
      addToast(res.data.message, res.data.inWatchlist ? 'success' : 'info');
      return res.data.inWatchlist;
    } catch (err) {
      addToast('Failed to update watchlist.', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      guestLogin,
      logout,
      toggleUserWatchlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
