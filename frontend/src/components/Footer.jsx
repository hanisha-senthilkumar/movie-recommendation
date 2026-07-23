import React from 'react';
import { Film, Cpu, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--border-light)] bg-[var(--bg-page)]/90 py-10 px-4 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--text-secondary)]">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-[#F2B84B]" />
          <span className="font-display tracking-wider text-xl text-white">CINEMATCH</span>
          <span className="text-xs text-slate-500">| Premium AI Recommendations</span>
        </div>

        {/* Center tech badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-hover)] border border-[var(--border-light)] text-xs">
          <Cpu className="w-3.5 h-3.5 text-[#F2B84B]" />
          <span>Powered by Item-Based KNN Collaborative Filtering (Cosine Similarity)</span>
        </div>

        {/* Right copyright */}
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#B3273A] fill-current" />
          <span>for Film Lovers &copy; {new Date().getFullYear()} CineMatch</span>
        </div>
      </div>
    </footer>
  );
};
