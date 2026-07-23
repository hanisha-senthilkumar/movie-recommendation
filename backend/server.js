const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Required for Render

// Connect Database (MongoDB or In-Memory Mode)
connectDB();

// Middleware - Allow all origins (CORS)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());

// Route Imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health Check Endpoint (must respond FAST for Render port scan)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'CineMatch Node Backend API',
    timestamp: new Date()
  });
});

// Serve React Frontend (Static files from built dist folder)
const frontendBuild = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuild));

// React Router: catch-all (must come AFTER API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// Start Server — bind to 0.0.0.0 for Render
app.listen(PORT, HOST, () => {
  console.log(`[CineMatch] Server running on ${HOST}:${PORT}`);
  console.log(`[CineMatch] Health: http://${HOST}:${PORT}/api/health`);
});
