import { Request, Response } from 'express';
import * as orderService from './order.service';
import mongoose from 'mongoose';
import Order from './order.model';

// الحصول على جميع الطلبيات
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// الحصول على طلبية بواسطة المعرف
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// إنشاء طلبية جديدة
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;
    
    // التحقق من وجود البيانات المطلوبة حسب نوع الطلبية
    if (orderData.type === 'purchase') {
      if (!orderData.supplierId || !orderData.items || orderData.items.length === 0) {
        res.status(400).json({ error: 'Supplier ID and at least one item are required for purchase orders' });
        return;
      }
    } else {
      if (!orderData.customerId || !orderData.items || orderData.items.length === 0) {
        res.status(400).json({ error: 'Customer ID and at least one item are required for sales orders' });
        return;
      }
    }
    
    // إنشاء معرف فريد للطلبية إذا لم يكن موجوداً
    if (!orderData.orderNumber) {
      orderData.orderNumber = `ORD-${Date.now()}`;
    }
    
    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// الحصول على طلبيات المورد
export const getOrdersBySupplierId = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierId = req.params.supplierId;
    const orders = await orderService.getOrdersBySupplierId(supplierId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier orders' });
  }
};

// تحديث طلبية
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const orderData = req.body;
    
    const updatedOrder = await orderService.updateOrder(orderId, orderData);
    
    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// حذف طلبية
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await orderService.deleteOrder(orderId);
    
    if (!deletedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// الحصول على طلبيات عميل معين
export const getOrdersByCustomerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.params.customerId;
    const orders = await orderService.getOrdersByCustomerId(customerId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
};

// تحديث حالة الطلبية
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status || !['pending', 'processing', 'completed', 'cancelled', 'draft',`ready`].includes(status)) {
      res.status(400).json({ error: 'Valid status (pending, processing, completed, cancelled, draft) is required' });
      return;
    }
    
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// تحديث حالة التسليم
export const updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const { deliveryStatus } = req.body;
    
    if (!deliveryStatus || !['pending', 'shipped', 'delivered', 'returned'].includes(deliveryStatus)) {
      res.status(400).json({ error: 'Valid delivery status (pending, shipped, delivered, returned) is required' });
      return;
    }
    
    const updatedOrder = await orderService.updateDeliveryStatus(orderId, deliveryStatus);
    
    if (!updatedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

// البحث عن الطلبيات
export const searchOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    const orders = await orderService.searchOrders(query);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search orders' });
  }
};

// الحصول على الطلبيات حسب الحالة
export const getOrdersByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.params.status;
    
    if (!['pending', 'processing', 'completed', 'cancelled', 'draft'].includes(status)) {
      res.status(400).json({ error: 'Valid status (pending, processing, completed, cancelled, draft) is required' });
      return;
    }
    
    const orders = await orderService.getOrdersByStatus(status);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
};

// الحصول على الطلبيات حسب حالة التسليم
export const getOrdersByDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveryStatus = req.params.deliveryStatus;
    
    if (!['pending', 'shipped', 'delivered', 'returned'].includes(deliveryStatus)) {
      res.status(400).json({ error: 'Valid delivery status (pending, shipped, delivered, returned) is required' });
      return;
    }
    
    const orders = await orderService.getOrdersByDeliveryStatus(deliveryStatus);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by delivery status' });
  }
};

// الحصول على الطلبيات حسب النوع
export const getOrdersByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.params.type;
    
    if (!['sales', 'purchase'].includes(type)) {
      res.status(400).json({ error: 'Valid type (sales, purchase) is required' });
      return;
    }
    
    const orders = await orderService.getOrdersByType(type);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by type' });
  }
};

// الحصول على الطلبيات حسب معرف الشركة
export const getOrdersByCompanyId = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.companyId;
    
    if (!companyId) {
      res.status(400).json({ error: 'معرف الشركة مطلوب' });
      return;
    }
    
    const orders = await orderService.getOrdersByCompanyId(companyId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب طلبات الشركة' });
  }
};

// الحصول على الطلبيات حسب معرف المنشئ
export const getOrdersByIssuedBy = async (req: Request, res: Response): Promise<void> => {
  try {
    const issuedBy = req.params.issuedBy;
    
    if (!issuedBy) {
      res.status(400).json({ error: 'معرف المنشئ مطلوب' });
      return;
    }
    
    const orders = await orderService.getOrdersByIssuedBy(issuedBy);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب الطلبيات المنشأة بواسطة المستخدم' });
  }
};



// تحديث معرف السائق للطلبية
export const updateOrderDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const { driverId } = req.body;

    if (!driverId) {
      res.status(400).json({ error: 'معرف السائق مطلوب' });
      return;
    }

    const updatedOrder = await orderService.updateOrderDriver(orderId, driverId);

    if (!updatedOrder) {
      res.status(404).json({ error: 'الطلبية غير موجودة' });
      return;
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'فشل في تحديث معرف السائق للطلبية' });
  }
};

// الحصول على الطلبيات حسب معرف السائق
export const getOrdersByDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const driverId = req.params.driverId;
    const orders = await orderService.getOrdersByDriver(driverId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب طلبيات السائق' });
  }
};

// حذف جميع الطلبيات
export const deleteAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await orderService.deleteAllOrders();
    res.json({ message: `Successfully deleted ${result.deletedCount} orders` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete all orders' });
  }
};