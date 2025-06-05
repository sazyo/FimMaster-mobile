import { Router } from 'express';
import * as expenseController from './expense.controller';

const router = Router();

// Base routes for expenses
router.route('/')
  .get(expenseController.getAllExpenses)
  .post(expenseController.createExpense);

// Search expenses
router.get('/search', expenseController.searchExpenses);

// Get expenses by method
router.get('/method/:method', expenseController.getExpensesByMethod);

// Get expenses by date
router.get('/date/:date', expenseController.getExpensesByDate);

// Get expenses by date range
router.get('/date-range', expenseController.getExpensesByDateRange);

// Get expenses by supplier
router.get('/supplier/:supplierId', expenseController.getExpensesBySupplierId);

// Get expenses by invoice
router.get('/invoice/:invoiceId', expenseController.getExpensesByInvoiceId);

// Get expenses by company
router.get('/company/:companyId', expenseController.getExpensesByCompanyId);

// Get expenses by created user
router.get('/user/:userId', expenseController.getExpensesByCreatedBy);

// Delete all expenses
router.delete('/delete-all', expenseController.deleteAllExpenses);

// Routes for specific expense by ID
router.route('/:id')
  .get(expenseController.getExpenseById)
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

export default router;