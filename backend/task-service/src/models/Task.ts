import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  userId: string;
}

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  userId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);
