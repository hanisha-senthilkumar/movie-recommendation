const mongoose = require('mongoose');

let isInMemoryFallback = false;
const inMemoryStore = {
  users: new Map(),
  ratings: [],
  watchlists: new Map() // userId -> Set of movieIds
};

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinematch';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[CineMatch DB] MongoDB connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    isInMemoryFallback = true;
    console.warn(`[CineMatch DB] Local MongoDB unavailable (${err.message}).`);
    console.log(`[CineMatch DB] Activated built-in In-Memory Database Mode for instant operation!`);
  }
};

const getInMemoryStore = () => inMemoryStore;
const checkIsInMemory = () => isInMemoryFallback;

module.exports = {
  connectDB,
  getInMemoryStore,
  checkIsInMemory
};
