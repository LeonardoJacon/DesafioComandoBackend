import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export const generateToken = (userId: string) =>{return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '2h' });};

export function verifyToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch (error) {
    throw new Error('Invalid token');
  }}