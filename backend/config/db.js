const mongoose = require('mongoose');

let isInMemoryFallback = false;
const inMemoryStore = {
  users: new Map(),
  ratings: [],
  watchlists: new Map() // userId -> Set of movieIds
};

const connectDB = async () => {
  const connString = process.env.MONGODB_URI;

  // If no MONGODB_URI is set, skip entirely and use in-memory
  if (!connString) {
    isInMemoryFallback = true;
    console.log('[CineMatch DB] No MONGODB_URI set — using built-in In-Memory Database. All data resets on restart.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[CineMatch DB] MongoDB connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    isInMemoryFallback = true;
    console.warn(`[CineMatch DB] MongoDB connection failed (${err.message}).`);
    console.log(`[CineMatch DB] Activated built-in In-Memory Database Mode.`);
  }
};

const getInMemoryStore = () => inMemoryStore;
const checkIsInMemory = () => isInMemoryFallback;

module.exports = {
  connectDB,
  getInMemoryStore,
  checkIsInMemory
};
