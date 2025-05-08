import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

import authRoutes from './routes/auth.routes';
import todoRoutes from './routes/todo.routes';
import { configurePassport } from './config/passport';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Configure Passport
configurePassport();

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-auth')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 