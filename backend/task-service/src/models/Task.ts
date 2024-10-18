import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  dueDate: string;
  priority: string;
  userId: string
}

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  priority: { type: String, required: true },
  userId: {type: String, required: true}
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);
