import { Request, Response } from 'express';
import * as serviceService from './service.service';
import Service from './service.model';
import mongoose from 'mongoose';

// Delete all services
export const deleteAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    await serviceService.deleteAllServices();
    res.json({ message: 'تم حذف جميع الخدمات بنجاح' });
  } catch (error: any) {
    res.status(500).json({ error: 'فشل في حذف جميع الخدمات', details: error.message });
  }
};

// Get all services
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.query.companyId as string;
    const services = await serviceService.getAllServices(companyId);
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: 'فشل في جلب الخدمات', details: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params.id;
    const service = await serviceService.getServiceById(serviceId);
    
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Create new service
export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceData = {
      ...req.body,
      companyId: req.body.companyId,
      createdBy: req.body.userId
    };

    if (!serviceData.companyId || !serviceData.createdBy) {
      res.status(400).json({ error: 'معرف الشركة والمستخدم المنشئ مطلوبان' });
      return;
    }

    const newService = await serviceService.createService(serviceData);
    res.status(201).json(newService);
  } catch (error: any) {
    res.status(500).json({ error: 'فشل في إنشاء الخدمة', details: error.message });
  }
};

// Update service
export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params.id;
    const serviceData = req.body;
    
    const updatedService = await serviceService.updateService(serviceId, serviceData);
    
    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Delete service
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params.id;
    const deletedService = await serviceService.deleteService(serviceId);
    
    if (!deletedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

// Add expense to service
export const addExpenseToService = async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params.id;
    const expenseData = req.body;
    
    if (!expenseData.expenseId || !expenseData.amount) {
      res.status(400).json({ error: 'Expense ID and amount are required' });
      return;
    }
    
    try {
      // Validate expense ID format
      new mongoose.Types.ObjectId(expenseData.expenseId);
    } catch (idError) {
      res.status(400).json({ error: 'Invalid expense ID format' });
      return;
    }
    
    const updatedService = await serviceService.addExpenseToService(serviceId, expenseData);
    
    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    
    res.json(updatedService);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add expense to service', details: error.message });
  }
};

// Remove expense from service
export const removeExpenseFromService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: serviceId, expenseId } = req.params;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    // Find the expense in the expense history
    const expenseIndex = service.expenseHistory.findIndex(
      (expense) => expense.expenseId.toString() === expenseId
    );
    
    if (expenseIndex === -1) {
      res.status(404).json({ message: 'Expense not found in service\'s expense history' });
      return;
    }

    // Remove the expense from the expense history
    service.expenseHistory.splice(expenseIndex, 1);
    
    // Save the updated service
    await service.save();
    
    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get services by supplier
export const getServicesBySupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierId = req.params.supplierId;

    

    const services = await serviceService.getServicesBySupplier(supplierId);
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: 'فشل في جلب الخدمات للمورد', details: error.message });
  }
};

// Add invoice to service
export const addInvoiceToService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: serviceId } = req.params;
    const { invoiceId } = req.body;

    if (!invoiceId) {
      res.status(400).json({ error: 'Invoice ID is required' });
      return;
    }

    const updatedService = await serviceService.addInvoiceToService(serviceId, invoiceId);
    
    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json(updatedService);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add invoice to service', details: error.message });
  }
};

// Get service invoices
export const getServiceInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: serviceId } = req.params;
    const invoices = await serviceService.getServiceInvoices(serviceId);
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service invoices' });
  }
};

// Add service provider
export const addServiceProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: serviceId } = req.params;
    const { providerId } = req.body;

    if (!providerId) {
      res.status(400).json({ error: 'Provider ID is required' });
      return;
    }

    try {
      new mongoose.Types.ObjectId(providerId);
    } catch (idError) {
      res.status(400).json({ error: 'Invalid provider ID format' });
      return;
    }

    const updatedService = await serviceService.addServiceProvider(serviceId, providerId);
    
    if (!updatedService) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    res.json(updatedService);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add service provider', details: error.message });
  }
};

// Get services by company
export const getServicesByCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.companyId;
    const services = await serviceService.getServicesByCompany(companyId);
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: 'فشل في جلب الخدمات للشركة', details: error.message });
  }
};

// Get services by creator
export const getServicesByCreator = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const services = await serviceService.getServicesByCreator(userId);
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ error: 'فشل في جلب الخدمات للمستخدم المنشئ', details: error.message });
  }
};

// Remove service provider
export const removeServiceProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: serviceId, providerId } = req.params;
    
    const updatedService = await serviceService.removeServiceProvider(serviceId, providerId);
    
    if (!updatedService) {
      res.status(404).json({ error: 'Service or provider not found' });
      return;
    }

    res.json(updatedService);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove service provider', details: error.message });
  }
};