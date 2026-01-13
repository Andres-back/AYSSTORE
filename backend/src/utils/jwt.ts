import * as jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  return jwt.verify(token, secret);
};
