import mongoose, { Schema, Document } from 'mongoose';

// Update the interface
export interface IService extends Document {
  name: string;
  description?: string;
  totalExpenses: number;
  serviceProviders: mongoose.Types.ObjectId[];
  invoices: mongoose.Types.ObjectId[]; 
  expenseHistory: Array<{
    amount: number;
    date: Date;
    description?: string;
    expenseId: mongoose.Types.ObjectId;
  }>;
  isActive: boolean;
  companyId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'اسم الخدمة مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
    serviceProviders: [{
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [false],
    }],
    
    // Add invoices field
    invoices: [{
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    }],
    
    expenseHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: String,
        expenseId: {
          type: Schema.Types.ObjectId,
          ref: 'Expense',
          required: true
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    companyId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Company', 
      required: false 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.pre('save', async function(next) {
  if (this.isModified('expenseHistory')) {
    this.totalExpenses = this.expenseHistory.reduce((total, expense) => total + expense.amount, 0);
  }
  next();
});

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;