import mongoose, { Document, Schema, Model } from 'mongoose';
import { SupplierType } from '../supplier/supplier.model';

// تعريف واجهة للطرق
interface OrderMethods {
  calculateTotalAmount(): number;
}

export interface OrderDocument extends Document, OrderMethods {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  customer: {
    customerName?: string;
    companyName?: string;
    phone?: number;
  };
  supplier: {
    supplierName?: string;
    companyName?: string;
    phone?: number;
    supplierType?: SupplierType;
  };
  amount: number;
  status: string;
  date: string;
  deliveryDate: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    freeQuantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  issuedBy: mongoose.Types.ObjectId;
  notes: string;
  type: 'sales' | 'purchase';
  email: string;

  deliveryStatus: string;
  deliveryAddress: string;
  deliveryNotes: string;
  driverId: mongoose.Types.ObjectId;
}

// إنشاء نوع Model الذي يعرف OrderMethods
type OrderModel = Model<OrderDocument, {}, OrderMethods>;

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: false },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    customer: {
      customerName: { type: String },
      companyName: { type: String },
      phone: { type: Number }
    },
    email: { type: String },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      required: false, 
      enum: ['pending', 'processing', 'completed', 'cancelled', 'draft',`ready`],
      default: 'pending'
    },
    date: { type: String, required: true },
    deliveryDate: { type: String, required: false },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        freeQuantity: { type: Number, required: true, default: 0 },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    notes: { type: String, required: false },
    type: { type: String, enum: ['sales', 'purchase'], default: 'sales' },
    // حقول خاصة بالطلبيات
    deliveryStatus: { 
      type: String, 
      enum: ['pending', 'shipped', 'delivered', 'returned'], 
      default: 'pending' 
    },
    deliveryAddress: { type: String },
    deliveryNotes: { type: String },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

OrderSchema.methods.calculateTotalAmount = function() {
  const totalAmount = this.items.reduce((sum: number, item: {
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    freeQuantity: number;
    unitPrice: number;
    totalPrice: number;
  }) => sum + item.totalPrice, 0);
  this.amount = totalAmount;
  return this.amount;
};



// إضافة hook قبل الحفظ لتحديث المبالغ
OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}`;
  }
  
  next();
});

const Order = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);

export default Order;