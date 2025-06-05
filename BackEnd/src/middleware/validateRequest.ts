/*import { Request, Response, NextFunction } from 'express';

interface ValidationRule {
  type: string;
  required?: boolean;
  enum?: string[];
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const validateRequest = (schema: { body?: ValidationSchema; query?: ValidationSchema; params?: ValidationSchema }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate body
    if (schema.body) {
      for (const [key, rule] of Object.entries(schema.body)) {
        if (rule.required && !req.body[key]) {
          errors.push(`${key} is required`);
        } else if (req.body[key] && typeof req.body[key] !== rule.type) {
          errors.push(`${key} must be of type ${rule.type}`);
        } else if (rule.enum && req.body[key] && !rule.enum.includes(req.body[key])) {
          errors.push(`${key} must be one of: ${rule.enum.join(', ')}`);
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }

    next();
  };
}; */