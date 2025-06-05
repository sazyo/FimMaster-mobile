import { Router } from 'express';
import * as serviceController from './service.controller';

const router = Router();

// Get all services and create new service
router.route('/services')
  .get(serviceController.getAllServices)
  .post(serviceController.createService);

// Delete all services
router.delete('/services/delete-all', serviceController.deleteAllServices);

// Get, update, and delete service by ID
router.route('/services/:id')
  .get(serviceController.getServiceById)
  .put(serviceController.updateService)
  .delete(serviceController.deleteService);

// Add expense to service
router.route('/services/:id/expenses')
  .post(serviceController.addExpenseToService);

// Remove expense from service
router.delete('/services/:id/expenses/:expenseId', serviceController.removeExpenseFromService);

// Get services by supplier
router.get('/suppliers/:supplierId/services', serviceController.getServicesBySupplier);

// Add invoice to service
router.post('/services/:id/invoices', serviceController.addInvoiceToService);

// Get service invoices
router.get('/services/:id/invoices', serviceController.getServiceInvoices);

// Add service provider
router.post('/services/:id/providers', serviceController.addServiceProvider);

// Remove service provider
router.delete('/services/:id/providers/:providerId', serviceController.removeServiceProvider);

// Get services by company
router.get('/companies/:companyId/services', serviceController.getServicesByCompany);

// Get services by creator
router.get('/services/created-by/:userId', serviceController.getServicesByCreator);

export default router;