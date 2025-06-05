import mongoose, { Document, Schema } from 'mongoose';

export interface PaymentDocument extends Document {
  paymentId: string;
  customerId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  date: string;
  cheques: mongoose.Types.ObjectId[];  
  createdBy: mongoose.Types.ObjectId;
  status: string;        
  notes: string;        
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema({
  paymentId: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  companyId: { type: String, ref: 'Company', required: false },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: false },
  amount: { type: Number, required: true },
  method: { type: String, required: true, enum: ['cash', 'check','card'] },
  date: { type: String, required: true },
  cheques: [{ type: Schema.Types.ObjectId, ref: 'Cheque' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  notes: { type: String },
  reference: { type: String },
}, { timestamps: true });

export default mongoose.model<PaymentDocument>('Payment', PaymentSchema);