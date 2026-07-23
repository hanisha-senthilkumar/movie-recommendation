const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  movieId: {
    type: Number,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5.0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Composite index to ensure one rating per user per movie
RatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
