import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messagesRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://eazy-connect-app.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Root route - fixes the "Cannot GET /" error
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'EazyConnect Backend is running',
    endpoints: {
      auth: '/api/auth',
      messages: '/api/messages'
    }
  });
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 8747;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});