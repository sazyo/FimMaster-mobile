import Order, { OrderDocument } from './order.model';
import mongoose from 'mongoose';
import Customer from '../customer/customer.model';
import Supplier from '../supplier/supplier.model';

// الحصول على جميع الطلبيات
export const getAllOrders = async (): Promise<OrderDocument[]> => {
  try {
    return await Order.find()
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName supplierType')
      .populate('driverId', 'firstName lastName username')
      .populate('issuedBy', 'firstName lastName username');
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
};

// الحصول على طلبية بواسطة المعرف
export const getOrderById = async (id: string): Promise<OrderDocument | null> => {
  try {
    return await Order.findById(id)
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName supplierType')
      .populate('issuedBy', 'firstName lastName username');
  } catch (error) {
    throw new Error(`Failed to fetch order with ID: ${id}`);
  }
};

// الحصول على طلبيات المورد
export const getOrdersBySupplierId = async (supplierId: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ supplierId })
      .populate('supplierId', 'supplierName companyName supplierType');
  } catch (error) {
    throw new Error(`Failed to fetch orders for supplier with ID: ${supplierId}`);
  }
};

// إنشاء طلبية جديدة
export const createOrder = async (orderData: Partial<OrderDocument>): Promise<OrderDocument> => {
  try {
    const newOrder = new Order(orderData);
    
    // حساب المبلغ الإجمالي للطلبية
    newOrder.calculateTotalAmount();
    
    // حفظ الطلبية
    const savedOrder = await newOrder.save();
    
  
    
    
    return savedOrder;
  } catch (error) {
    throw new Error('Failed to create order');
  }
};

// تحديث طلبية
export const updateOrder = async (id: string, orderData: Partial<OrderDocument>): Promise<OrderDocument | null> => {
  try {
    const order = await Order.findById(id);
    if (!order) return null;
    
    // تحديث البيانات
    Object.assign(order, orderData);
    
    // إعادة حساب المبلغ الإجمالي إذا تم تحديث العناصر
    if (orderData.items !== undefined) {
      order.calculateTotalAmount();
    }
    
    return await order.save();
  } catch (error) {
    throw new Error(`Failed to update order with ID: ${id}`);
  }
};

// حذف طلبية
export const deleteOrder = async (id: string): Promise<OrderDocument | null> => {
  try {
    const order = await Order.findById(id);
    if (!order) return null;
    
    // إزالة الإشارة إلى الطلبية من العميل أو المورد
    if (order.type === 'sales' && order.customerId) {
      await Customer.findByIdAndUpdate(
        order.customerId,
        { $pull: { orderList: order._id } }
      );
    } else if (order.type === 'purchase' && order.supplierId) {
      await Supplier.findByIdAndUpdate(
        order.supplierId,
        { $pull: { orderList: order._id } }
      );
    }
    
    return await Order.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete order with ID: ${id}`);
  }
};

// الحصول على طلبيات عميل معين
export const getOrdersByCustomerId = async (customerId: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ customerId })
      .populate('customerId', 'customerName companyName');
  } catch (error) {
    throw new Error(`Failed to fetch orders for customer with ID: ${customerId}`);
  }
};

// تحديث حالة الطلبية
export const updateOrderStatus = async (id: string, status: string, driverId?: string): Promise<OrderDocument | null> => {
  try {
    const updateFields: any = { status };
    if (driverId) {
      updateFields.driverId = driverId;
    }
    return await Order.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
  } catch (error) {
    throw new Error(`Failed to update status for order with ID: ${id}`);
  }
};

// تحديث حالة التسليم
export const updateDeliveryStatus = async (id: string, deliveryStatus: string): Promise<OrderDocument | null> => {
  try {
    return await Order.findByIdAndUpdate(
      id,
      { deliveryStatus },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Failed to update delivery status for order with ID: ${id}`);
  }
};

// البحث عن الطلبيات
export const searchOrders = async (query: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({
      $or: [
        { orderNumber: { $regex: query, $options: 'i' } },
        { status: { $regex: query, $options: 'i' } },
        { deliveryStatus: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('customerId', 'customerName companyName')
    .populate('supplierId', 'supplierName companyName');
  } catch (error) {
    throw new Error(`Failed to search orders with query: ${query}`);
  }
};

// الحصول على الطلبيات حسب الحالة
export const getOrdersByStatus = async (status: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ status })
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName');
  } catch (error) {
    throw new Error(`Failed to fetch orders with status: ${status}`);
  }
};

// الحصول على الطلبيات حسب حالة التسليم
export const getOrdersByDeliveryStatus = async (deliveryStatus: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ deliveryStatus })
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName');
  } catch (error) {
    throw new Error(`Failed to fetch orders with delivery status: ${deliveryStatus}`);
  }
};

// الحصول على الطلبيات حسب النوع
export const getOrdersByType = async (type: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ type })
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName')
      .populate('items.productId');
  } catch (error) {
    throw new Error(`Failed to fetch orders with type: ${type}`);
  }
};

// الحصول على الطلبيات حسب معرف الشركة
export const getOrdersByCompanyId = async (companyId: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ companyId })
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName supplierType')
      .populate('issuedBy', 'firstName lastName username')
      .populate('driverId', 'firstName lastName username');
  } catch (error) {
    throw new Error(`فشل في جلب طلبات الشركة رقم: ${companyId}`);
  }
};

// الحصول على الطلبيات حسب معرف المنشئ
export const getOrdersByIssuedBy = async (issuedBy: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ issuedBy })
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName supplierType')
      .populate('companyId', 'name')
      .populate('issuedBy', 'firstName lastName username');
  } catch (error) {
    throw new Error(`فشل في جلب الطلبيات المنشأة بواسطة المستخدم رقم: ${issuedBy}`);
  }
};





// تحديث معرف السائق للطلبية
export const updateOrderDriver = async (orderId: string, driverId: string): Promise<OrderDocument | null> => {
  try {
    return await Order.findByIdAndUpdate(
      orderId,
      { driverId },
      { new: true }
    ).populate('driverId', 'name');
  } catch (error) {
    throw new Error(`فشل في تحديث معرف السائق للطلبية: ${orderId}`);
  }
};

// الحصول على الطلبيات حسب معرف السائق
export const getOrdersByDriver = async (driverId: string): Promise<OrderDocument[]> => {
  try {
    return await Order.find({ driverId })
      .populate('customerId', 'customerName companyName')
      .populate('supplierId', 'supplierName companyName')
      .populate('driverId', 'name');
  } catch (error) {
    throw new Error(`فشل في جلب طلبيات السائق: ${driverId}`);
  }
};

// حذف جميع الطلبيات
export const deleteAllOrders = async (): Promise<{ deletedCount: number }> => {
  try {
    // الحصول على جميع الطلبيات أولاً للتعامل مع البيانات المرتبطة
    const orders = await Order.find();
    
    // معالجة كل طلبية لتنظيف البيانات المرتبطة
    await Promise.all(orders.map(async (order) => {
      // إزالة الإشارة إلى الطلبية من العميل
      if (order.customerId) {
        await Customer.findByIdAndUpdate(
          order.customerId,
          { $pull: { orderList: order._id } }
        );
      }
      
      // إزالة الإشارة إلى الطلبية من المورد
      if (order.supplierId) {
        await Supplier.findByIdAndUpdate(
          order.supplierId,
          { $pull: { orderList: order._id } }
        );
      }
    }));
    
    // أخيراً حذف جميع الطلبيات
    const result = await Order.deleteMany({});
    return { deletedCount: result.deletedCount || 0 };
  } catch (error) {
    throw new Error('Failed to delete all orders');
  }
};