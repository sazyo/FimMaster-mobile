import mongoose from 'mongoose';
import Company, { CompanyDocument } from './company.model';
import * as fs from 'fs';
import * as path from 'path';

// Get all companies
export const getAllCompanies = async (): Promise<CompanyDocument[]> => {
  try {
    return await Company.find()
      .populate('authorizedUsers', 'username email role firstName lastName phoneNumber address profileImage status lastLogin permissions settings createdAt updatedAt nots phone')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Failed to fetch companies');
  }
};

// Get company by ID
export const getCompanyById = async (id: string): Promise<CompanyDocument | null> => {
  try {
    return await Company.findById(id)
      .populate('authorizedUsers', 'username email role firstName lastName phoneNumber address profileImage status lastLogin permissions settings createdAt updatedAt nots phone');
  } catch (error) {
    throw new Error(`Failed to fetch company with ID: ${id}`);
  }
};

// Create a new company
export const createCompany = async (companyData: Partial<CompanyDocument>): Promise<CompanyDocument> => {
  try {
    // Ensure subscription end date is valid
    if (!companyData.subscriptionEndDate) {
      // Set default end date (30 days from now)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      companyData.subscriptionEndDate = endDate;
    }
    
    // Set default subscription status if not provided
    if (!companyData.subscriptionStatus) {
      companyData.subscriptionStatus = 'active';
    }
    
    // If createdBy is not provided, it will be null (optional field now)
    // This allows any user (even unauthenticated) to create a company
    
    const newCompany = new Company(companyData);
    return await newCompany.save();
  } catch (error) {
    console.error('Error creating company:', error);
    throw new Error('Failed to create company');
  }
};

// Update company
export const updateCompany = async (id: string, companyData: Partial<CompanyDocument>): Promise<CompanyDocument | null> => {
  try {
    return await Company.findByIdAndUpdate(id, companyData, { new: true });
  } catch (error) {
    throw new Error(`Failed to update company with ID: ${id}`);
  }
};

// Delete company
export const deleteCompany = async (id: string): Promise<CompanyDocument | null> => {
  try {
    return await Company.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete company with ID: ${id}`);
  }
};

// Update company subscription
export const updateSubscription = async (
  companyId: string, 
  subscriptionType: string,
  subscriptionEndDate: Date
): Promise<CompanyDocument | null> => {
  try {
    return await Company.findByIdAndUpdate(
      companyId, 
      { 
        subscriptionType,
        subscriptionStatus: subscriptionType === 'expired' ? 'expired' : 'active',
        subscriptionEndDate
      }, 
      { new: true }
    ).populate('authorizedUsers', 'username email role firstName lastName phoneNumber');
  } catch (error) {
    console.error(`Error updating subscription for company with id ${companyId}:`, error);
    throw error;
  }
};

// Add authorized user
export const addAuthorizedUser = async (companyId: string, userId: string): Promise<CompanyDocument | null> => {
  try {
    return await Company.findByIdAndUpdate(
      companyId,
      { $addToSet: { authorizedUsers: userId } },
      { new: true }
    ).populate('authorizedUsers', 'username email role firstName lastName phoneNumber');
  } catch (error) {
    throw new Error(`Failed to add authorized user to company with ID: ${companyId}`);
  }
};

// Remove authorized user
export const removeAuthorizedUser = async (companyId: string, userId: string): Promise<CompanyDocument | null> => {
  try {
    return await Company.findByIdAndUpdate(
      companyId,
      { $pull: { authorizedUsers: userId } },
      { new: true }
    ).populate('authorizedUsers', 'username email role firstName lastName phoneNumber');
  } catch (error) {
    throw new Error(`Failed to remove authorized user from company with ID: ${companyId}`);
  }
};

// Get company authorized users
export const getCompanyAuthorizedUsers = async (companyId: string) => {
  try {
    const company = await Company.findById(companyId)
      .populate({
        path: 'authorizedUsers',
        select: 'username email role firstName lastName phoneNumber address profileImage status lastLogin permissions settings createdAt updatedAt nots phone'

        
      });
    
    if (!company) {
      throw new Error('Company not found');
    }
    
    return company.authorizedUsers;
  } catch (error) {
    throw new Error(`Failed to fetch authorized users for company with ID: ${companyId}`);
  }
};

// Search companies
export const searchCompanies = async (query: string): Promise<CompanyDocument[]> => {
  try {
    return await Company.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { contactEmail: { $regex: query, $options: 'i' } },
        { taxNumber: { $regex: query, $options: 'i' } }
      ]
    }).populate('authorizedUsers', 'username email role');
  } catch (error) {
    throw new Error(`Failed to search companies with query: ${query}`);
  }
};

// Get companies with expiring subscriptions
export const getExpiringSubscriptions = async (daysThreshold: number = 7): Promise<CompanyDocument[]> => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    return await Company.find({
      subscriptionStatus: 'active',
      subscriptionEndDate: { 
        $gte: new Date(), 
        $lte: thresholdDate 
      }
    }).populate('authorizedUsers', 'username email role');
  } catch (error) {
    throw new Error('Failed to fetch companies with expiring subscriptions');
  }
};



// Get company statistics
export const getCompanyStatistics = async (companyId: string): Promise<any> => {
  try {
    const company = await Company.findById(companyId);
    
    if (!company) {
      throw new Error('Company not found');
    }
    
    // Count authorized users
    const userCount = company.authorizedUsers.length;
    
    // Check subscription status
    const currentDate = new Date();
    const subscriptionEndDate = company.subscriptionEndDate ? new Date(company.subscriptionEndDate) : null;
    const activeSubscription = company.subscriptionStatus === 'active' && 
                               subscriptionEndDate && 
                               subscriptionEndDate > currentDate;
    
    // Calculate days left in subscription
    let subscriptionDaysLeft = null;
    if (subscriptionEndDate && activeSubscription) {
      const diffTime = Math.abs(subscriptionEndDate.getTime() - currentDate.getTime());
      subscriptionDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    return {
      userCount,
      activeSubscription,
      subscriptionDaysLeft,
      subscriptionType: company.subscriptionType,
      subscriptionEndDate: company.subscriptionEndDate
    };
  } catch (error) {
    console.error(`Error fetching company statistics for company with ID ${companyId}:`, error);
    throw error;
  }
};