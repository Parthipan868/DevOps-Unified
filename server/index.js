import dotenv from 'dotenv';
dotenv.config(); // Load environment variables FIRST

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes AFTER dotenv is loaded
import apiRoutes from './routes/api.js';

// Basic route
app.get('/', (req, res) => {
  res.send('DevOps Unified Dashboard API is running');
});

// API Routes
app.use('/api', apiRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devops-dashboard');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
