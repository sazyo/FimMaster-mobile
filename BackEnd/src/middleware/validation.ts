import { Request, Response, NextFunction } from 'express';

interface ReportRequestBody {
  type: string;
  dateRange: {
    from: string | Date;
    to: string | Date;
  };
}

export const validateReport = (
  req: Request<{}, {}, ReportRequestBody>,
  res: Response,
  next: NextFunction
): void => {  // Changed return type to void
  const { type, dateRange } = req.body;
  
  if (!type || !dateRange || !dateRange.from || !dateRange.to) {
    res.status(400).json({ error: 'Missing required report parameters' });
    return;
  }
  
  // Validate date format
  const fromDate = new Date(dateRange.from);
  const toDate = new Date(dateRange.to);
  
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    res.status(400).json({ error: 'Invalid date format' });
    return;
  }
  
  if (fromDate > toDate) {
    res.status(400).json({ error: 'Start date must be before end date' });
    return;
  }
  
  const validTypes = ['sales', 'expense', 'inventory', 'customer', 'profit-loss'] as const;
  if (!validTypes.includes(type as typeof validTypes[number])) {
    res.status(400).json({ error: 'Invalid report type' });
    return;
  }
  
  next();
};