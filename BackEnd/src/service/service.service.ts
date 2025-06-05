import Service, { IService } from './service.model';
import mongoose from 'mongoose';
import Supplier from '../supplier/supplier.model';
export const getAllServices = async (companyId?: string): Promise<IService[]> => {
  try {
    const query = companyId ? { companyId } : {};
    return await Service.find(query)
      .populate('serviceProviders', 'supplierName companyName')
      .populate('expenseHistory.expenseId')
      .populate('createdBy', 'name email');
  } catch (error) {
    throw new Error('فشل في جلب الخدمات');
  }
};

// Get service by ID
export const getServiceById = async (id: string): Promise<IService | null> => {
  try {
    return await Service.findById(id)
      .populate('serviceProviders', 'supplierName companyName')
      .populate('expenseHistory.expenseId');
  } catch (error) {
    throw new Error(`Failed to fetch service with ID: ${id}`);
  }
};

// Create new service
export const createService = async (serviceData: Partial<IService>): Promise<IService> => {
  try {
    if (!serviceData.companyId || !serviceData.createdBy) {
      throw new Error('معرف الشركة والمستخدم المنشئ مطلوبان');
    }
    const newService = new Service(serviceData);
    return await newService.save();
  } catch (error: any) {
    throw new Error(`فشل في إنشاء الخدمة: ${error.message}`);
  }
};

// Update service
export const updateService = async (id: string, serviceData: Partial<IService>): Promise<IService | null> => {
  try {
    return await Service.findByIdAndUpdate(id, serviceData, { new: true });
  } catch (error) {
    throw new Error(`Failed to update service with ID: ${id}`);
  }
};

// Delete service
export const deleteService = async (id: string): Promise<IService | null> => {
  try {
    return await Service.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete service with ID: ${id}`);
  }
};

// Add expense to service
export const addExpenseToService = async (
  serviceId: string, 
  expenseData: { 
    expenseId: string; 
    amount: number; 
    description?: string; 
    date?: Date 
  }
): Promise<IService | null> => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) return null;

    // Create new expense entry
    const newExpense = {
      expenseId: new mongoose.Types.ObjectId(expenseData.expenseId),
      amount: expenseData.amount,
      description: expenseData.description || '',
      date: expenseData.date || new Date()
    };

    // Add to expense history
    service.expenseHistory.push(newExpense);
    
    // Save the updated service
    return await service.save();
  } catch (error) {
    throw new Error(`Failed to add expense to service with ID: ${serviceId}`);
  }
};

// Get services by supplier
export const getServicesBySupplier = async (supplierId: string): Promise<IService[]> => {
  try {
    return await Service.find({ serviceProviders: supplierId})
      .populate('expenseHistory.expenseId')
      .populate('createdBy', 'name email');
  } catch (error) {
    throw new Error(`فشل في جلب الخدمات للمورد: ${supplierId}`);
  }
};

// Add invoice to service
export const addInvoiceToService = async (
  serviceId: string,
  invoiceId: string
): Promise<IService | null> => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) return null;

    // Add invoice if it doesn't exist
    if (!service.invoices.includes(new mongoose.Types.ObjectId(invoiceId))) {
      service.invoices.push(new mongoose.Types.ObjectId(invoiceId));
    }

    return await service.save();
  } catch (error) {
    throw new Error(`Failed to add invoice to service with ID: ${serviceId}`);
  }
};

// Get service invoices
export const getServiceInvoices = async (serviceId: string): Promise<any[]> => {
  try {
    const service = await Service.findById(serviceId).populate('invoices');
    if (!service) throw new Error('Service not found');
    return service.invoices;
  } catch (error) {
    throw new Error(`Failed to fetch invoices for service with ID: ${serviceId}`);
  }
};

// Add service provider
export const addServiceProvider = async (
  serviceId: string,
  providerId: string
): Promise<IService | null> => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) return null;

    // Add provider if it doesn't exist
    if (!service.serviceProviders.includes(new mongoose.Types.ObjectId(providerId))) {
      service.serviceProviders.push(new mongoose.Types.ObjectId(providerId));
    }

    return await service.save();
  } catch (error) {
    throw new Error(`Failed to add service provider with ID: ${providerId}`);
  }
};

// Remove service provider
export const removeServiceProvider = async (
  serviceId: string,
  providerId: string
): Promise<IService | null> => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) return null;

    // Check if service has at least one provider before removal
    if (service.serviceProviders.length <= 1) {
      throw new Error('Service must have at least one provider');
    }

    // Remove provider
    service.serviceProviders = service.serviceProviders.filter(
      (provider) => provider.toString() !== providerId
    );

    return await service.save();
  } catch (error) {
    throw new Error(`Failed to remove service provider with ID: ${providerId}`);
  }
};

// Get services by company
export const getServicesByCompany = async (companyId: string): Promise<IService[]> => {
  try {
    return await Service.find({ companyId })
      .populate('serviceProviders', 'supplierName companyName')
      .populate('expenseHistory.expenseId')
      .populate('createdBy', 'name email');
  } catch (error) {
    throw new Error(`فشل في جلب الخدمات للشركة: ${companyId}`);
  }
};

// Get services by creator
export const getServicesByCreator = async (userId: string): Promise<IService[]> => {
  try {
    return await Service.find({ createdBy: userId })
      .populate('serviceProviders', 'supplierName companyName')
      .populate('expenseHistory.expenseId')
      .populate('createdBy', 'name email');
  } catch (error) {
    throw new Error(`فشل في جلب الخدمات للمستخدم: ${userId}`);
  }
};

// Delete all services
export const deleteAllServices = async (): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get all services
    const services = await Service.find({});

    // Get all service IDs
    const serviceIds = services.map(service => service._id);

    // Update suppliers to remove references to these services
    await Supplier.updateMany(
      { services: { $in: serviceIds } },
      { $pull: { services: { $in: serviceIds } } },
      { session }
    );

    // Delete all services
    await Service.deleteMany({}, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new Error('Failed to delete all services');
  } finally {
    session.endSession();
  }
};