import { Request, Response } from 'express';
import * as companyService from './company.service';

// Extend the Express Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

// Get all companies
export const getAllCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch companies';
    res.status(500).json({ error: errorMessage });
  }
};

// Get a company by ID
export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const company = await companyService.getCompanyById(companyId);
    
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(company);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch company';
    res.status(500).json({ error: errorMessage });
  }
};

// Create a new company
export const createCompany = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Add the ID of the user who created the company if available
    // Making createdBy optional to allow any user to create a company
    const companyData = {
      ...req.body,
      // Use provided userId, or authenticated user id, or null if neither exists
      createdBy: req.body.userId || req.user?.id || null
    };
    
    const newCompany = await companyService.createCompany(companyData);
    res.status(201).json(newCompany);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create company';
    res.status(500).json({ error: errorMessage });
  }
};

// Update a company
export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const companyData = req.body;
    
    const updatedCompany = await companyService.updateCompany(companyId, companyData);
    
    if (!updatedCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(updatedCompany);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update company';
    res.status(500).json({ error: errorMessage });
  }
};

// Delete a company
export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const deletedCompany = await companyService.deleteCompany(companyId);
    
    if (!deletedCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete company';
    res.status(500).json({ error: errorMessage });
  }
};

// Update company subscription
export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const { subscriptionType, subscriptionEndDate } = req.body;
    
    if (!subscriptionType || !subscriptionEndDate) {
      res.status(400).json({ error: 'Subscription type and end date are required' });
      return;
    }
    
    const endDate = new Date(subscriptionEndDate);
    const updatedCompany = await companyService.updateSubscription(
      companyId, 
      subscriptionType, 
      endDate
    );
    
    if (!updatedCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(updatedCompany);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update subscription';
    res.status(500).json({ error: errorMessage });
  }
};

// Add an authorized user
export const addAuthorizedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const { userId } = req.body;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const updatedCompany = await companyService.addAuthorizedUser(companyId, userId);
    
    if (!updatedCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(updatedCompany);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add authorized user';
    res.status(500).json({ error: errorMessage });
  }
};

// Remove an authorized user
export const removeAuthorizedUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const userId = req.query.userId as string;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const updatedCompany = await companyService.removeAuthorizedUser(companyId, userId);
    
    if (!updatedCompany) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    
    res.json(updatedCompany);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove authorized user';
    res.status(500).json({ error: errorMessage });
  }
};

// Get authorized users for a company
export const getAuthorizedUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.id;
    const users = await companyService.getCompanyAuthorizedUsers(companyId);
    if (!users) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    res.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch authorized users';
    res.status(500).json({ error: errorMessage });
  }
};

// Search for companies
export const searchCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    const companies = await companyService.searchCompanies(query);
    res.json(companies);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search companies';
    res.status(500).json({ error: errorMessage });
  }
};

// Get companies with soon-to-expire subscriptions
export const getExpiringSubscriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const daysThreshold = parseInt(req.query.days as string) || 7;
    const companies = await companyService.getExpiringSubscriptions(daysThreshold);
    res.json(companies);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch companies with expiring subscriptions';
    res.status(500).json({ error: errorMessage });
  }
};

