import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  userId?: string; // Extend the Request type to include userId
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('No token is received in request');
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'secret_key' as string) as { userId: string };
    
    // Explicitly cast the request to include the userId
    (req as CustomRequest).userId = decoded.userId;

    next();
  } catch (error) {
    console.log('Token verification failed:', error);
  
    if (error instanceof jwt.TokenExpiredError) {
      console.log(`Token expired at: ${error.expiredAt}`);
      res.status(401).json({ message: 'Token expired. Please log in again.' });
      return
    }
  
    res.status(400).json({ message: 'Invalid token.' });
  }
  
};

export default authMiddleware;
