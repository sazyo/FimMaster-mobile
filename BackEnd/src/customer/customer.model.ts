import mongoose, { Document, Schema } from 'mongoose';

export interface CustomerDocument extends Document {
  customerName: string;
  companyName: string;
  customerType: string;
  phone: string;
  balanceDue: number;
  invoiceList: mongoose.Types.ObjectId[]; 
  paymentList: mongoose.Types.ObjectId[]; 
  geographicalLocation: string;
  location: string;
  notes: string;
  companyId: mongoose.Types.ObjectId;
  salesmanId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema({
  customerName: { type: String, required: true, unique: true },
  companyName: { type: String, required: true, unique: true },
  customerType: { type: String, required: true },
  phone: { type: String, required: true },
  balanceDue: { type: Number, default: 0 },
  invoiceList: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }], 
  paymentList: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  geographicalLocation: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
  salesmanId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

export default mongoose.model<CustomerDocument>('Customer', CustomerSchema);