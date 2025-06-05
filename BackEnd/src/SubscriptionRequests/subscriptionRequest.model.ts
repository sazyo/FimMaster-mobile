import mongoose, { Document, Schema } from 'mongoose';

export interface SubscriptionRequestDocument extends Document {
  company: {
    name: string;
    avatar: string;
  };
  contactName: string;
  email: string;
  phone: string;
  country: string;
  companySize: string;
  industry: string;
  plan: string;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  processedBy?: Schema.Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionRequestSchema = new Schema<SubscriptionRequestDocument>(
  {
    company: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    companySize: { type: String, required: true },
    industry: { type: String, required: true },
    plan: { type: String, required: true },
    additionalInfo: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<SubscriptionRequestDocument>('SubscriptionRequest', subscriptionRequestSchema);