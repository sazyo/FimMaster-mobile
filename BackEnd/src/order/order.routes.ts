import { Router } from 'express';
import * as orderController from './order.controller';

const router = Router();

// الحصول على جميع الطلبيات وإنشاء طلبية جديدة
router.route('/orders')
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

// البحث عن الطلبيات
router.get('/orders/search', orderController.searchOrders);

// الحصول على الطلبيات حسب الحالة
router.get('/orders/status/:status', orderController.getOrdersByStatus);

// الحصول على الطلبيات حسب حالة التسليم
router.get('/orders/delivery-status/:deliveryStatus', orderController.getOrdersByDeliveryStatus);

// الحصول على الطلبيات حسب النوع (مبيعات أو مشتريات)
router.get('/orders/type/:type', orderController.getOrdersByType);

// الحصول على طلبيات عميل معين
router.get('/orders/customer/:customerId', orderController.getOrdersByCustomerId);

// الحصول على طلبيات مورد معين
router.get('/orders/supplier/:supplierId', orderController.getOrdersBySupplierId);

// حذف جميع الطلبيات
router.delete('/orders/delete-all', orderController.deleteAllOrders);

// الحصول على طلبية محددة وتحديثها وحذفها
router.route('/orders/:id')
  .get(orderController.getOrderById)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

// تحديث حالة الطلبية
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// تحديث حالة التسليم
router.patch('/orders/:id/delivery-status', orderController.updateDeliveryStatus);

// تحديث معرف السائق للطلبية
router.patch('/orders/:id/driver', orderController.updateOrderDriver);

// الحصول على الطلبيات حسب معرف السائق
router.get('/orders/driver/:driverId', orderController.getOrdersByDriver);

// الحصول على الطلبيات حسب معرف الشركة
router.get('/orders/company/:companyId', orderController.getOrdersByCompanyId);

// الحصول على الطلبيات حسب معرف المنشئ
router.get('/orders/issued-by/:issuedBy', orderController.getOrdersByIssuedBy);

export default router;