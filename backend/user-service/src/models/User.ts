import mongoose, { Document } from 'mongoose';

// Define the IUser interface that includes the _id property
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
}

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
}, { timestamps: true });

// Export the User model
export default mongoose.model<IUser>('User', userSchema);
