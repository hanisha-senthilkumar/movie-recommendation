import React from 'react';
import { motion } from 'framer-motion';
import { MovieCard } from './MovieCard';
import { SkeletonLoader } from './SkeletonLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export const MovieGrid = ({ movies = [], loading = false, onMovieClick, showScore = false }) => {
  if (loading) {
    return <SkeletonLoader count={8} />;
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
    >
      {movies.map((movie) => (
        <motion.div key={movie.id} variants={itemVariants}>
          <MovieCard movie={movie} onClick={onMovieClick} showScore={showScore} />
        </motion.div>
      ))}
    </motion.div>
  );
};
