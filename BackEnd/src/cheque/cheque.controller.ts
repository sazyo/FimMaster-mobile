import { Request, Response } from 'express';
import * as chequeService from './cheque.service';
import mongoose from 'mongoose';

// الحصول على جميع الشيكات
export const getAllCheques = async (req: Request, res: Response): Promise<void> => {
  try {
    const cheques = await chequeService.getAllCheques();
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cheques' });
  }
};

// الحصول على شيك بواسطة المعرف
export const getChequeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const chequeId = req.params.id;
    const cheque = await chequeService.getChequeById(chequeId);
    
    if (!cheque) {
      res.status(404).json({ error: 'Cheque not found' });
      return;
    }
    
    res.json(cheque);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cheque' });
  }
};

// إنشاء شيك جديد
export const createCheque = async (req: Request, res: Response): Promise<void> => {
  try {
    const chequeData = req.body;
    
    // التحقق من وجود البيانات المطلوبة
    if (!chequeData.chequeNumber || !chequeData.bankName || !chequeData.amount) {
      res.status(400).json({ error: 'Cheque number, bank name, and amount are required' });
      return;
    }
    
    // التحقق من وجود معرف العميل أو المورد
    if (!chequeData.customerId && !chequeData.supplierId) {
      res.status(400).json({ error: 'Either customer ID or supplier ID is required' });
      return;
    }
    
    const newCheque = await chequeService.createCheque(chequeData);
    res.status(201).json(newCheque);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cheque' });
  }
};

// تحديث شيك
export const updateCheque = async (req: Request, res: Response): Promise<void> => {
  try {
    const chequeId = req.params.id;
    const chequeData = req.body;
    
    const updatedCheque = await chequeService.updateCheque(chequeId, chequeData);
    
    if (!updatedCheque) {
      res.status(404).json({ error: 'Cheque not found' });
      return;
    }
    
    res.json(updatedCheque);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cheque' });
  }
};

// حذف شيك
export const deleteCheque = async (req: Request, res: Response): Promise<void> => {
  try {
    const chequeId = req.params.id;
    const deletedCheque = await chequeService.deleteCheque(chequeId);
    
    if (!deletedCheque) {
      res.status(404).json({ error: 'Cheque not found' });
      return;
    }
    
    res.json({ message: 'Cheque deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cheque' });
  }
};

// تحديث حالة الشيك
export const updateChequeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const chequeId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }
    
    const updatedCheque = await chequeService.updateChequeStatus(chequeId, status);
    
    if (!updatedCheque) {
      res.status(404).json({ error: 'Cheque not found' });
      return;
    }
    
    res.json(updatedCheque);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cheque status' });
  }
};

// الحصول على شيكات عميل معين
export const getChequesByCustomerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.params.customerId;
    const cheques = await chequeService.getChequesByCustomerId(customerId);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer cheques' });
  }
};

// الحصول على شيكات مورد معين
export const getChequesBySupplierId = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierId = req.params.supplierId;
    const cheques = await chequeService.getChequesBySupplierId(supplierId);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier cheques' });
  }
};

// الحصول على شيكات مصروف معين
export const getChequesByExpenseId = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseId = req.params.expenseId;
    const cheques = await chequeService.getChequesByExpenseId(expenseId);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense cheques' });
  }
};

// الحصول على شيكات دفعة معينة
export const getChequesByPaymentId = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = req.params.paymentId;
    const cheques = await chequeService.getChequesByPaymentId(paymentId);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment cheques' });
  }
};

// الحصول على الشيكات حسب النوع
export const getChequesByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.params.type;
    const cheques = await chequeService.getChequesByType(type);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cheques by type' });
  }
};

// الحصول على الشيكات حسب الحالة
export const getChequesByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.params.status;
    const cheques = await chequeService.getChequesByStatus(status);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cheques by status' });
  }
};

// البحث عن الشيكات
export const searchCheques = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    const cheques = await chequeService.searchCheques(query);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search cheques' });
  }
};

// الحصول على الشيكات حسب التاريخ
export const getChequesByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const date = req.params.date;
    const cheques = await chequeService.getChequesByDate(date);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cheques by date' });
  }
};

// الحصول على الشيكات في فترة زمنية محددة
export const getChequesByDateRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string };
    
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Start date and end date are required' });
      return;
    }
    
    const cheques = await chequeService.getChequesByDateRange(startDate, endDate);
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cheques by date range' });
  }
};