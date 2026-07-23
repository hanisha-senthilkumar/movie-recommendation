import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#B3273A]/20 via-[#F2B84B]/20 to-transparent border border-[#F2B84B]/30 flex items-center justify-center text-[#F2B84B] shadow-2xl mb-6">
          <Film className="w-12 h-12 rotate-12" />
        </div>

        <h1 className="font-display text-8xl text-white leading-none tracking-wider">404</h1>
        <h2 className="font-display text-3xl text-[#F2B84B] mt-2">REEL NOT FOUND</h2>
        
        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-8">
          The scene or page you are looking for has been edited out of the script.
        </p>

        <Link
          to="/"
          className="btn-amber px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cinema Main Hall</span>
        </Link>
      </main>

      <Footer />
    </div>
  );
};
