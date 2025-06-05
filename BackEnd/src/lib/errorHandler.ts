import { Response } from 'express';
import { NotFoundError, BadRequestError } from './errors';

export const handleError = (error: Error, res: Response) => {
  console.error(error);

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof BadRequestError) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}; 