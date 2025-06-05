import { Request, Response } from 'express';
import * as subscriptionRequestService from './subscriptionRequest.service';
import { Types } from 'mongoose';

// جلب جميع طلبات الاشتراك
export const getAllSubscriptionRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await subscriptionRequestService.getAllSubscriptionRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب طلبات الاشتراك' });
  }
};

// جلب طلب اشتراك بواسطة المعرف
export const getSubscriptionRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.id;
    const request = await subscriptionRequestService.getSubscriptionRequestById(requestId);
    
    if (!request) {
      res.status(404).json({ error: 'طلب الاشتراك غير موجود' });
      return;
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب طلب الاشتراك' });
  }
};

// إنشاء طلب اشتراك جديد
export const createSubscriptionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestData = req.body;
    const newRequest = await subscriptionRequestService.createSubscriptionRequest(requestData);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'فشل في إنشاء طلب الاشتراك' });
  }
};

// تحديث حالة طلب الاشتراك
export const updateSubscriptionRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const userId = new Types.ObjectId(req.body.userId); // يجب أن يكون هناك معرف المستخدم في الطلب

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'حالة غير صالحة' });
      return;
    }

    const updatedRequest = await subscriptionRequestService.updateSubscriptionRequestStatus(
      requestId,
      status,
      userId
    );

    if (!updatedRequest) {
      res.status(404).json({ error: 'طلب الاشتراك غير موجود' });
      return;
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث حالة طلب الاشتراك' });
  }
};

// حذف طلب اشتراك
export const deleteSubscriptionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.id;
    const deletedRequest = await subscriptionRequestService.deleteSubscriptionRequest(requestId);

    if (!deletedRequest) {
      res.status(404).json({ error: 'طلب الاشتراك غير موجود' });
      return;
    }

    res.json({ message: 'تم حذف طلب الاشتراك بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل في حذف طلب الاشتراك' });
  }
};

// البحث في طلبات الاشتراك
export const searchSubscriptionRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'يجب توفير مصطلح البحث' });
      return;
    }

    const requests = await subscriptionRequestService.searchSubscriptionRequests(query);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'فشل في البحث عن طلبات الاشتراك' });
  }
};

// جلب طلبات الاشتراك حسب الحالة
export const getSubscriptionRequestsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.params.status;
    const requests = await subscriptionRequestService.getSubscriptionRequestsByStatus(status);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب طلبات الاشتراك حسب الحالة' });
  }
};