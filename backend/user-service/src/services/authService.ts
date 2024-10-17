import jwt from 'jsonwebtoken';

export const generateJWTToken = (userId: string) => {
  return jwt.sign({ userId }, 'secret_key', { expiresIn: '1h' });
};
