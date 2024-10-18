import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string,
  dueDate: string;
  priority: string;
  userId: string,
  status: string
}

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String},
  dueDate: { type: String, required: true },
  priority: { type: String, required: true },
  userId: {type: String, required: true},
  status:  {type: String},
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);
