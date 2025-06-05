import { Router } from 'express';
import * as supplierController from './supplier.controller';

const router = Router();

// Get all suppliers and create new supplier
router.route('/suppliers')
  .get(supplierController.getAllSuppliers)
  .post(supplierController.createSupplier);

// Search suppliers
router.route('/suppliers/search')
  .get(supplierController.searchSuppliers);

// Get suppliers by company
router.route('/suppliers/company/:companyId')
  .get(supplierController.getSuppliersByCompany);

// Get suppliers by user
router.route('/suppliers/user/:userId')
  .get(supplierController.getSuppliersByUser);

// Get, update, and delete supplier by ID
router.route('/suppliers/:id')
  .get(supplierController.getSupplierById)
  .put(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

// Supplier invoices
router.route('/suppliers/:supplierId/invoices')
  .post(supplierController.addInvoiceToSupplier)
  .get(supplierController.getSupplierInvoices);

// Supplier expenses
router.route('/suppliers/:id/expenses')
  .get(supplierController.getSupplierExpenses)
  .post(supplierController.addExpenseToSupplier);

// Supplier services
router.route('/suppliers/:id/services')
  .get(supplierController.getSupplierServices)
  .post(supplierController.addServiceToSupplier);

// Remove service from supplier
router.delete('/suppliers/:id/services/:serviceId', supplierController.removeServiceFromSupplier);

// Supplier cheques
router.route('/suppliers/:id/cheques')
  .get(supplierController.getSupplierCheques);

// حذف دفعة من قائمة مدفوعات العميل
router.delete('/suppliers/:id/expenses/:expenseId', supplierController.removeExpenseFromSupplier);

export default router;