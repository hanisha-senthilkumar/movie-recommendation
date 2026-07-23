import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Film, AlertCircle, HelpCircle } from 'lucide-react';
import { RotatingBackdrop } from '../components/RotatingBackdrop';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[var(--bg-page)]">
      {/* Rotating Background */}
      <RotatingBackdrop intervalSeconds={10} />

      {/* Centered Auth Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 w-full max-w-md bg-[var(--bg-page)]/95 border border-[var(--border-light)] rounded-3xl p-8 sm:p-10 flex flex-col justify-between backdrop-blur-2xl shadow-2xl shadow-black/50"
      >
        <div>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <Film className="w-6 h-6 text-[#F2B84B]" />
            <span className="font-display text-3xl tracking-widest text-white">CINEMATCH</span>
          </Link>

          <h2 className="font-display text-4xl text-white tracking-wide">Welcome Back</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">
            Sign in to access your personalized KNN movie recommendations.
          </p>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-sm text-white focus:outline-none focus:border-[#F2B84B] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#F2B84B] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-sm text-white focus:outline-none focus:border-[#F2B84B] transition-colors"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-[var(--bg-hover)] border-white/20 text-[#F2B84B] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-[var(--text-secondary)] cursor-pointer">
                Remember this session for 7 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-amber py-3 rounded-xl mt-4 font-bold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In to CineMatch'
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-[var(--border-light)] text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#F2B84B] font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </motion.div>

      {/* Stubbed Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-light)] space-y-4">
            <div className="flex items-center gap-2 text-[#F2B84B]">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-display text-xl text-white">Reset Password</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              For security, please contact system administration or register a new CineMatch account.
            </p>
            <button
              onClick={() => {
                setShowForgotModal(false);
                addToast('Password reset link sent to registered email address.', 'info');
              }}
              className="w-full btn-amber py-2 rounded-xl text-xs font-bold"
            >
              Send Reset Instructions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
