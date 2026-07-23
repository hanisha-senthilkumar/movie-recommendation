import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKDROPS = [
  "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAiW5.jpg", // Inception
  "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsX2f.jpg", // Interstellar
  "https://image.tmdb.org/t/p/original/9uG1qBwAQHzabT324utaw9vFu2x.jpg", // The Matrix
  "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oSM2xSuIm.jpg"  // Pulp Fiction
];

export const RotatingBackdrop = ({ intervalSeconds = 10 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BACKDROPS.length);
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [intervalSeconds]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Film Grain Layer */}
      <div className="film-grain" />

      {/* Crossfading Movie Backdrop Images */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat filter brightness-[0.6] contrast-[1.1] saturate-[1.2]"
          style={{ backgroundImage: `url(${BACKDROPS[index]})` }}
        />
      </AnimatePresence>

      {/* Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/70 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-transparent to-[#0B0D12] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0D12_90%)] opacity-70" />
    </div>
  );
};
