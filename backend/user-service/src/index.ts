import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const app = express();
const PORT = 5001;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/task-manager-users', {
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});
