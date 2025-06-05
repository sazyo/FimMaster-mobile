import mongoose, { Document, Schema } from 'mongoose';

export interface ChequeDocument extends Document {
  chequeId: string;  // معرف الشيك الخاص
  chequeNumber: string;
  bankName: string;
  chequeDate: string;
  amount: number;
  holderName?: string;  
  holderPhone?: string; 
  status: string; 
  type: string;  
  customerId?: mongoose.Types.ObjectId;  
  supplierId?: mongoose.Types.ObjectId;  
  paymentId?: mongoose.Types.ObjectId;  
  expenseId?: mongoose.Types.ObjectId;  
  createdAt: Date;
  updatedAt: Date;
}

const ChequeSchema = new Schema({
  chequeId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `CHQ-${Date.now()}-${Math.floor(Math.random() * 1000)}` 
  },  // معرف الشيك الخاص
  chequeNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  chequeDate: { type: String, required: true },
  amount: { type: Number, required: true },
  holderName: { type: String, required: false },  // اسم صاحب الشيك (اختياري)
  holderPhone: { type: String, required: false },  // رقم هاتف صاحب الشيك (اختياري)
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'cleared', 'bounced'],  // حالة الشيك
    default: 'pending' 
  },
  type: {
    type: String,
    required: true,
    enum: ['received', 'issued'],  
  },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: false },
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: false },
  expenseId: { type: Schema.Types.ObjectId, ref: 'Expense', required: false },
}, { timestamps: true });


ChequeSchema.pre('validate', function(next) {

  if ((this.customerId && this.supplierId) || (!this.customerId && !this.supplierId)) {
    return next(new Error('الشيك يجب أن يكون مرتبط إما بعميل أو مورد، وليس كلاهما أو لا شيء'));
  }
  

  if (this.paymentId && this.expenseId) {
    return next(new Error('الشيك يمكن أن يكون مرتبط إما بدفعة أو مصروف، وليس كلاهما'));
  }
  
  next();
});

export default mongoose.model<ChequeDocument>('Cheque', ChequeSchema);