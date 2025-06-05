import { Types } from 'mongoose';
import SubscriptionRequest, { SubscriptionRequestDocument } from './subscriptionRequest.model';

// جلب جميع طلبات الاشتراك
export const getAllSubscriptionRequests = async (): Promise<SubscriptionRequestDocument[]> => {
  try {
    return await SubscriptionRequest.find().populate('processedBy', 'name email');
  } catch (error) {
    throw new Error('فشل في جلب طلبات الاشتراك');
  }
};

// جلب طلب اشتراك بواسطة المعرف
export const getSubscriptionRequestById = async (id: string): Promise<SubscriptionRequestDocument | null> => {
  try {
    return await SubscriptionRequest.findById(id).populate('processedBy', 'name email');
  } catch (error) {
    throw new Error(`فشل في جلب طلب الاشتراك بالمعرف: ${id}`);
  }
};

// إنشاء طلب اشتراك جديد
export const createSubscriptionRequest = async (data: Partial<SubscriptionRequestDocument>): Promise<SubscriptionRequestDocument> => {
  try {
    const subscriptionRequest = new SubscriptionRequest(data);
    return await subscriptionRequest.save();
  } catch (error) {
    throw new Error('فشل في إنشاء طلب الاشتراك');
  }
};

// تحديث حالة طلب الاشتراك
export const updateSubscriptionRequestStatus = async (
  id: string,
  status: 'approved' | 'rejected',
  userId: Types.ObjectId
): Promise<SubscriptionRequestDocument | null> => {
  try {
    return await SubscriptionRequest.findByIdAndUpdate(
      id,
      {
        status,
        processedBy: userId,
        processedAt: new Date(),
      },
      { new: true }
    ).populate('processedBy', 'name email');
  } catch (error) {
    throw new Error(`فشل في تحديث حالة طلب الاشتراك: ${id}`);
  }
};

// حذف طلب اشتراك
export const deleteSubscriptionRequest = async (id: string): Promise<SubscriptionRequestDocument | null> => {
  try {
    return await SubscriptionRequest.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`فشل في حذف طلب الاشتراك: ${id}`);
  }
};

// البحث في طلبات الاشتراك
export const searchSubscriptionRequests = async (query: string): Promise<SubscriptionRequestDocument[]> => {
  try {
    return await SubscriptionRequest.find({
      $or: [
        { 'company.name': { $regex: query, $options: 'i' } },
        { contactName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).populate('processedBy', 'name email');
  } catch (error) {
    throw new Error('فشل في البحث عن طلبات الاشتراك');
  }
};

// جلب طلبات الاشتراك حسب الحالة
export const getSubscriptionRequestsByStatus = async (status: string): Promise<SubscriptionRequestDocument[]> => {
  try {
    return await SubscriptionRequest.find({ status }).populate('processedBy', 'name email');
  } catch (error) {
    throw new Error(`فشل في جلب طلبات الاشتراك بالحالة: ${status}`);
  }
};