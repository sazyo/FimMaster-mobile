import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import userRoutes from './user/user.routes'
import customerRoutes from './customer/customer.routes'
import invoiceRoutes from './invoice/invoice.routes';
import paymentRoutes from './payment/payment.routes';
import chequeRoutes from './cheque/cheque.routes';
import companyRoutes from './company/company.routes';
import supplierRoutes from './supplier/supplier.routes'
import expenseRoutes from './expense/expense.routes'
import serviceRoutes from './service/service.routes'
import orderRoutes from './order/order.routes'
import SubscriptionRequests from './SubscriptionRequests/subscriptionRequest.routes'


import productRoutes from './product/product.routes'

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

// تكوين CORS للسماح بالاتصال من تطبيق React Native
app.use(cors({
  origin: '*', // السماح لجميع المصادر بالوصول إلى API
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Authorization']
}));

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('No MongoDB URI found in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Routes  product

app.use('/api/users', userRoutes);
app.use('/api', serviceRoutes);
app.use('/api', customerRoutes);
app.use('/api', supplierRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', paymentRoutes);

app.use('/api', companyRoutes);
app.use('/api', chequeRoutes);

app.use('/api', orderRoutes);
app.use('/api/subscription-requests', SubscriptionRequests);
app.use('/api', productRoutes);
app.use('/api/expenses', expenseRoutes);



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
