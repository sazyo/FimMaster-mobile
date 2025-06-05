
import User from './user.model';
import mongoose, { Document } from 'mongoose';

interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phone: number;
  role: string;
  companyId: mongoose.Types.ObjectId;
  nots?: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phone: number;
  role: string;
  companyId: mongoose.Types.ObjectId;
  nots?: string;
}): Promise<UserDocument> => {
  try {
    const newUser = new User(userData);
    return await newUser.save() as unknown as UserDocument;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserDocument[]> => {
  try {
    return await User.find();
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserDocument | null> => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<UserDocument>
): Promise<UserDocument | null> => {
  try {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<UserDocument | null> => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

export const getUserByUsername = async (username: string): Promise<UserDocument | null> => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    throw error;
  }
};

// Add these functions to your user.service.ts file

/**
 * الحصول على المستخدمين المصرح لهم للشركة
 */
export interface AuthorizedUser {
  id: string;
  email: string;
  name: string;
}

export const getAuthorizedUsersForCompany = async (companyId: string): Promise<AuthorizedUser[]> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new Error('معرف الشركة غير صالح');
    }

    const users = await User.find({ 
      companyId: new mongoose.Types.ObjectId(companyId)
    });
    
    if (!users.length) {
      return [];
    }

    return users.map(user => ({
      id: user._id.toString(),
      email: user.username,
      name: `${user.firstName} ${user.lastName}`
    }));
  } catch (error) {
    console.error(`خطأ في الحصول على المستخدمين المصرح لهم للشركة ${companyId}:`, error);
    throw error;
  }
};

/**
 * الحصول على المستخدمين المشرفين
 */
export const getAdminUsers = async (): Promise<AuthorizedUser[]> => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('_id firstName lastName username')
      .lean();
    
    if (!admins.length) {
      return [];
    }

    return admins.map(admin => ({
      id: admin._id.toString(),
      email: admin.username,
      name: `${admin.firstName} ${admin.lastName}`
    }));
  } catch (error) {
    console.error('خطأ في الحصول على المستخدمين المشرفين:', error);
    throw error;
  }
};

/**
 * إرسال إشعار إلى البريد الإلكتروني الرسمي للشركة
 */
export const sendNotificationToCompanyEmail = async (
  companyId: string, 
  subject: string, 
  message: string
): Promise<boolean> => {
  try {
    // هنا يمكنك استخدام خدمة البريد الإلكتروني لإرسال رسالة إلى البريد الرسمي للشركة
    // يمكن استخدام nodemailer أو أي خدمة أخرى
    
    console.log(`Sending email notification to company ${companyId}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // هنا يجب إضافة كود الإرسال الفعلي
    
    return true;
  } catch (error) {
    console.error(`Error sending notification to company ${companyId}:`, error);
    return false;
  }
};

/**
 * إرسال إشعار إلى مستخدمي الشركة عبر الواتساب
 */
export const sendWhatsAppNotificationToUsers = async (
  companyId: string,
  message: string
): Promise<boolean> => {
  try {
    // الحصول على المستخدمين المصرح لهم للشركة
    const users = await getAuthorizedUsersForCompany(companyId);
    
    // إرسال رسالة واتساب لكل مستخدم
    for (const user of users) {

      
      console.log(`Sending WhatsApp message to user ${user.name}`);
      console.log(`Message: ${message}`);
      
      // هنا يجب إضافة كود الإرسال الفعلي
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending WhatsApp notifications for company ${companyId}:`, error);
    return false;
  }
};

