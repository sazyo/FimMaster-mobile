import jwt from 'jsonwebtoken';

const JWT_SECRET = 'V6y9p3Xq1tRwAeZf2sHv8uKmNcJbL4D7gFtY5EhPd0S';

export const jwtUtils = {
  sign: (payload: any): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  },

  verify: (token: string): any => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};

export default jwtUtils;