import mongoose, { Document, Schema } from 'mongoose';

export interface ProductDocument extends Document {
  productName: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  unit: string;
  barcode: string;
  supplierIds: mongoose.Types.ObjectId[];
  minQuantity: number;
  images: string[];
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  productName: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, required: true },
  barcode: { type: String, unique: true },
  supplierIds: [{ type: Schema.Types.ObjectId, ref: 'Supplier' }],
  minQuantity: { type: Number, default: 5 },
  images: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

export default mongoose.model<ProductDocument>('Product', ProductSchema);
