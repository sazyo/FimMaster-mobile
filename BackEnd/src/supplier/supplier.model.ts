import mongoose, { Document, Schema } from 'mongoose';

export enum SupplierType {
  GOODS_SUPPLIER = 'goods_supplier',
  SERVICE_PROVIDER = 'service_provider'
}

export interface SupplierDocument extends Document {
  supplierName: string;
  companyName: string;
  supplierType: SupplierType;
  phone: string;
  balanceDue: number;
  invoiceList: mongoose.Types.ObjectId[]; 
  expenseList: mongoose.Types.ObjectId[]; 
  services?: mongoose.Types.ObjectId[]; 
  geographicalLocation: string;
  location: string;
  notes: string;
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema({
  supplierName: { type: String, required: true },
  companyName: { type: String, required: true },
  supplierType: { 
    type: String, 
    required: true,
    enum: Object.values(SupplierType),
    default: SupplierType.GOODS_SUPPLIER
  },
  phone: { type: String, required: true },
  balanceDue: { type: Number, default: 0 },
  invoiceList: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }], 
  expenseList: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }], // Added services array reference
  geographicalLocation: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

export default mongoose.model<SupplierDocument>('Supplier', SupplierSchema);