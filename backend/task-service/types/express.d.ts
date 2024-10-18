// types/express.d.ts (create this file to extend the Express Request type)
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    userId?: string;
  }
}
