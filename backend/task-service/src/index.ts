import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes';
import cors from 'cors';


const app = express();
const PORT = 5002;

mongoose.connect('mongodb://localhost:27017/task-manager-tasks', {
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Task service running on http://localhost:${PORT}`);
});
