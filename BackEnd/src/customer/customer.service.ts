import Customer, { CustomerDocument } from './customer.model';
import { InvoiceDocument as Invoice } from '../invoice/invoice.model';
import { PaymentDocument as Payment } from '../payment/payment.model';
import { Types } from 'mongoose';
import  mongoose  from 'mongoose';
// Get all customers
export const fetchAllCustomers = async (): Promise<CustomerDocument[]> => {
  try {
    return await Customer.find();
  } catch (error) {
    throw new Error('Failed to fetch customers');
  }
};

// Get customer by ID
export const getCustomerById = async (id: string): Promise<CustomerDocument | null> => {
  try {
    return await Customer.findById(id);
  } catch (error) {
    throw new Error(`Failed to fetch customer with ID: ${id}`);
  }
};

// Create new customer
export const createCustomer = async (customerData: Partial<CustomerDocument>): Promise<CustomerDocument> => {
  try {
   
    if (customerData.companyId) {
      const Company = mongoose.model('Company');
      const company = await Company.findById(customerData.companyId);
      if (!company) {
        throw new Error('الشركة المحددة غير موجودة');
      }
    }

    // التحقق من وجود المندوب إذا تم تحديد معرف المندوب
    if (customerData.salesmanId) {
      const User = mongoose.model('User');
      const salesman = await User.findById(customerData.salesmanId);
      if (!salesman) {
        throw new Error('المندوب المحدد غير موجود');
      }
    }

    const newCustomer = new Customer(customerData);
    return await newCustomer.save();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`فشل إنشاء العميل: ${error.message}`);
    }
    throw new Error('فشل إنشاء العميل');
  }
};

// Update customer
export const updateCustomer = async (id: string, customerData: Partial<CustomerDocument>): Promise<CustomerDocument | null> => {
  try {
    // التحقق من وجود الشركة إذا تم تحديد معرف الشركة
    if (customerData.companyId) {
      const Company = mongoose.model('Company');
      const company = await Company.findById(customerData.companyId);
      if (!company) {
        throw new Error('الشركة المحددة غير موجودة');
      }
    }

    // التحقق من وجود المندوب إذا تم تحديد معرف المندوب
    if (customerData.salesmanId) {
      const User = mongoose.model('User');
      const salesman = await User.findById(customerData.salesmanId);
      if (!salesman) {
        throw new Error('المندوب المحدد غير موجود');
      }
    }

    return await Customer.findByIdAndUpdate(id, customerData, { new: true });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`فشل تحديث العميل: ${error.message}`);
    }
    throw new Error(`فشل تحديث العميل برقم المعرف: ${id}`);
  }
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<CustomerDocument | null> => {
  try {
    return await Customer.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete customer with ID: ${id}`);
  }
};

// Add invoice to customer
export const addInvoiceToCustomer = async (customerId: string, invoiceData: any): Promise<CustomerDocument | null> => {
  try {    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      console.log('Customer not found');
      return null;
    }
    
    // Add bonus field if not present
    if (!invoiceData.bonus) {
      invoiceData.bonus = 0;
    }
    
    // Create the invoice first
    const invoiceModel = mongoose.model('Invoice');
    const newInvoice = new invoiceModel({
      ...invoiceData,
      customerId: customerId
    });
    
    // Save the invoice
    const savedInvoice = await newInvoice.save();
    console.log('Invoice saved:', savedInvoice._id);
    
    // Add the invoice reference to the customer
    if (!customer.invoiceList) {
      customer.invoiceList = [];
    }
    
    customer.invoiceList.push(savedInvoice._id);
    
    // Update customer balance
    customer.balanceDue += savedInvoice.amount;
    
    // Save the updated customer
    await customer.save();
    console.log('Customer updated with new invoice');
    
    return customer;
  } catch (error) {
    console.error('Error adding invoice to customer:', error);
    throw new Error(`Failed to add invoice to customer with ID: ${customerId}`);
  }
};

// Get customer invoices
export const getCustomerInvoices = async (customerId: string): Promise<any[]> => {
  try {
    const customer = await Customer.findById(customerId).populate('invoiceList');
    if (!customer) return [];;
    return customer.invoiceList;
  } catch (error) {
    throw new Error(`Failed to fetch invoices for customer with ID: ${customerId}`);
  }
};

/*
// Add payment to customer
export const addPaymentToCustomer = async (customerId: string, paymentData: any): Promise<CustomerDocument | null> => {
  try {
    console.log('Starting payment process for customer:', customerId);
    console.log('Payment data received:', JSON.stringify(paymentData, null, 2));
    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      console.log('Customer not found with ID:', customerId);
      return null;
    }
    
    // Create a new payment
    const PaymentModel = mongoose.model('Payment');
    
    // Calculate total amount (cash + all cheques)
    const chequeTotal = paymentData.chequePayments?.reduce((sum: number, cheque: any) => sum + cheque.amount, 0) || 0;
    const totalAmount = (paymentData.cashAmount || 0) + chequeTotal;
    
    console.log('Calculated payment amounts:', { cashAmount: paymentData.cashAmount, chequeTotal, totalAmount });
    
    // Create the payment object with all required fields
    const paymentObject = {
      customerId: customerId,
      paymentId: `PAY-${Date.now()}`, // Add a unique payment ID
      invoiceId: paymentData.invoiceId || 'UNKNOWN',
      invoiceNumber: paymentData.invoiceNumber || paymentData.invoiceId || 'UNKNOWN',
      amount: totalAmount,
      cashAmount: paymentData.cashAmount || 0,
      method: chequeTotal > 0 ? 'bank_transfer' : 'cash', // Changed from 'cheque' to 'bank_transfer'
      date: paymentData.date || new Date().toISOString().split('T')[0],
      reference: paymentData.reference || 'Payment with cheques',
      createdBy: paymentData.createdBy
    };
    
    // Validate all required fields are present
    if (!paymentObject.customerId || !paymentObject.createdBy) {
      throw new Error('Missing required fields: customerId or createdBy');
    }
    
    console.log('Creating payment with data:', paymentObject);
    const newPayment = new PaymentModel(paymentObject);
    
    // Save the payment with explicit error handling
    let savedPayment;
    try {
      savedPayment = await newPayment.save();
      console.log('Payment saved successfully with ID:', savedPayment._id);
    } catch (saveError) {
      console.error('Error saving payment:', saveError);
      // Fix the error typing
      const errorMessage = saveError instanceof Error ? saveError.message : 'Unknown error';
      throw new Error(`Payment validation failed: ${errorMessage}`);
    }
    
    // Create cheques if any
    if (paymentData.chequePayments && paymentData.chequePayments.length > 0) {
      console.log(`Processing ${paymentData.chequePayments.length} cheques`);
      const ChequeModel = mongoose.model('Cheque');
      
      // Array to store cheque references
      const chequeIds: mongoose.Types.ObjectId[] = [];
      
      // Create each cheque
      for (const chequeData of paymentData.chequePayments) {
        console.log('Creating cheque:', chequeData.chequeNumber);
        const newCheque = new ChequeModel({
          chequeNumber: chequeData.chequeNumber,
          bankName: chequeData.bankName,
          chequeDate: chequeData.chequeDate,
          amount: chequeData.amount,
          holderName: chequeData.holderName,
          holderPhone: chequeData.holderPhone,
          status: 'pending',
          type: 'received',
          customerId: customerId,
          paymentId: savedPayment._id
        });
        
        const savedCheque = await newCheque.save();
        console.log('Cheque saved successfully:', chequeData.chequeNumber);
        
        // Add cheque ID to array
        chequeIds.push(savedCheque._id);
      }
      
      // Update the payment with cheque references
      await PaymentModel.findByIdAndUpdate(
        savedPayment._id,
        { $set: { cheques: chequeIds } },
        { new: true }
      );
      
      console.log('Payment updated with cheque references');
    }
    
    // Add the payment reference to the customer
    if (!customer.paymentList) {
      customer.paymentList = [];
    }
    
    customer.paymentList.push(savedPayment._id);
    
    // Update customer balance
    customer.balanceDue -= totalAmount;
    console.log('Updated customer balance:', customer.balanceDue);
    
    // Save the updated customer
    const updatedCustomer = await customer.save();
    console.log('Customer updated successfully');
    
    return updatedCustomer;
  } catch (error) {
    console.error('Error adding payment to customer:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to add payment to customer with ID: ${customerId}`);
  }
};
*/
// Get customer payments
export const getCustomerPayments = async (customerId: string): Promise<any[]> => {
  try {
    // استخدام populate للصول على بيانات المدفوعات الكاملة
    const customer = await Customer.findById(customerId).populate('paymentList');
    if (!customer) return [];
    // @ts-ignore - نتجاهل خطأ TypeScript مؤقتًا
    return customer.paymentList;
  } catch (error) {
    throw new Error(`Failed to fetch payments for customer with ID: ${customerId}`);
  }
};

// Get customer cheques
export const getCustomerCheques = async (customerId: string): Promise<any[]> => {
  try {
    console.log('Fetching cheques for customer:', customerId);
    
    // استخدام نموذج الشيكات للبحث عن الشيكات المرتبطة بالعميل
    const ChequeModel = mongoose.model('Cheque');
    const cheques = await ChequeModel.find({ customerId: customerId })
      .sort({ chequeDate: 1 }) // ترتيب حسب تاريخ الشيك
      .populate('paymentId'); // جلب بيانات الدفعة المرتبطة
    
    console.log(`Found ${cheques.length} cheques for customer`);
    return cheques;
  } catch (error) {
    console.error('Error fetching customer cheques:', error);
    throw new Error(`Failed to fetch cheques for customer with ID: ${customerId}`);
  }
};

// Search customers by name, company, or location
export const searchCustomers = async (query: string): Promise<CustomerDocument[]> => {
  try {
    return await Customer.find({
      $or: [
        { customerName: { $regex: query, $options: 'i' } },
        { companyName: { $regex: query, $options: 'i' } },
        { geographicalLocation: { $regex: query, $options: 'i' } }
      ]
    });
  } catch (error) {
    throw new Error(`Failed to search customers with query: ${query}`);
  }
};

// Get customers by company ID
export const getCustomersByCompanyId = async (companyId: string): Promise<CustomerDocument[]> => {
  try {
    const Company = mongoose.model('Company');
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }
    return await Customer.find({ companyId });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`فشل في جلب عملاء الشركة: ${error.message}`);
    }
    throw new Error('فشل في جلب عملاء الشركة');
  }
};

// Get customers by salesman ID
export const getCustomersBySalesmanId = async (salesmanId: string): Promise<CustomerDocument[]> => {
  try {
    const User = mongoose.model('User');
    const salesman = await User.findById(salesmanId);
    if (!salesman) {
      throw new Error('المندوب غير موجود');
    }
    return await Customer.find({ salesmanId });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`فشل في جلب عملاء المندوب: ${error.message}`);
    }
    throw new Error('فشل في جلب عملاء المندوب');
  }
};

// Get orders by company ID
export const getOrdersByCompanyId = async (companyId: string): Promise<any[]> => {
  try {
    const Company = mongoose.model('Company');
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('الشركة غير موجودة');
    }
    const Order = mongoose.model('Order');
    return await Order.find({ companyId });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`فشل في جلب طلبات الشركة: ${error.message}`);
    }
    throw new Error('فشل في جلب طلبات الشركة');
  }
};

/**
 * Add payment to customer
 */
export const addPaymentToCustomer = async (customerId: string, paymentData: { paymentId: string }): Promise<any> => {
  try {    
    // تحويل معرف الدفعة إلى ObjectId
    const paymentObjectId = new mongoose.Types.ObjectId(paymentData.paymentId);
    
    // البحث عن العميل وتحديثه
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    if (!customer.paymentList.includes(paymentObjectId)) {
      customer.paymentList.push(paymentObjectId);
      await customer.save();
    } else {
      console.log(`Payment ${paymentData.paymentId} already exists in customer's payment list`);
    }
    
    return customer;
  } catch (error) {
    console.error('Error in addPaymentToCustomer service:', error);
    throw error;
  }
};

