import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Film, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { RotatingBackdrop } from '../components/RotatingBackdrop';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', score: 0, color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { label: 'Weak', score: 33, color: 'bg-rose-500' };
    if (score <= 4) return { label: 'Medium', score: 66, color: 'bg-[#F2B84B]' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword === formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const res = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    if (res.success) {
      navigate('/home');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[var(--bg-page)]">
      {/* Background */}
      <RotatingBackdrop intervalSeconds={10} />

      {/* Centered Auth Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative z-10 w-full max-w-md bg-[var(--bg-page)]/95 border border-[var(--border-light)] rounded-3xl p-8 sm:p-10 flex flex-col justify-between backdrop-blur-2xl shadow-2xl shadow-black/50"
      >
        <div>
          {/* Logo Header */}
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <Film className="w-6 h-6 text-[#F2B84B]" />
            <span className="font-display text-3xl tracking-widest text-white">CINEMATCH</span>
          </Link>

          <h2 className="font-display text-4xl text-white tracking-wide">Create Account</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">
            Join CineMatch to unlock personalized KNN AI movie recommendations.
          </p>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-sm text-white focus:outline-none focus:border-[#F2B84B] transition-colors"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Password
              </label>
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

              {/* Strength Bar */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    Strength: <strong className="text-white">{strength.label}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-light)] text-sm text-white focus:outline-none focus:border-[#F2B84B] transition-colors"
                />
              </div>
              {formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1 text-[11px]">
                  {passwordsMatch ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-rose-400">Passwords do not match</span>
                  )}
                </div>
              )}
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
                'Create CineMatch Account'
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-[var(--border-light)] text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F2B84B] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
