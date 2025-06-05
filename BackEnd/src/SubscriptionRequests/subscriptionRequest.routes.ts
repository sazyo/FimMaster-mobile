import express from 'express';
import * as subscriptionRequestController from './subscriptionRequest.controller';

const router = express.Router();

// جلب جميع طلبات الاشتراك
router.get('/', subscriptionRequestController.getAllSubscriptionRequests);

// جلب طلب اشتراك بواسطة المعرف
router.get('/:id', subscriptionRequestController.getSubscriptionRequestById);

// إنشاء طلب اشتراك جديد
router.post('/', subscriptionRequestController.createSubscriptionRequest);

// تحديث حالة طلب الاشتراك
router.patch('/:id/status', subscriptionRequestController.updateSubscriptionRequestStatus);

// حذف طلب اشتراك
router.delete('/:id', subscriptionRequestController.deleteSubscriptionRequest);

// البحث في طلبات الاشتراك
router.get('/search', subscriptionRequestController.searchSubscriptionRequests);

// جلب طلبات الاشتراك حسب الحالة
router.get('/status/:status', subscriptionRequestController.getSubscriptionRequestsByStatus);

export default router;