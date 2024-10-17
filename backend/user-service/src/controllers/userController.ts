import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User'; // Make sure this imports IUser correctly
import { generateJWTToken } from '../services/authService';
import mongoose from 'mongoose';


// Register a user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, name } = req.body;

  console.log(`email :: ${email}`);
  console.log(`password :: ${password}`);
  console.log(`name :: ${name}`);
  

  try {
    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();
    console.log('Sign up successful');
    
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    next(error);
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Cast the user as IUser or null
    const user = (await User.findOne({ email })) as IUser | null; 

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Safely access _id by asserting its type
    const userId = user._id as mongoose.Types.ObjectId; // Cast _id to ObjectId
    const token = generateJWTToken(userId.toString()); // Now _id should be recognized correctly

    console.log('Login successful');
    

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    next(error);
  }
};

