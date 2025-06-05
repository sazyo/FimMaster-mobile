import { Request, Response } from 'express';
import * as UserService from './user.service';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, username, password, phone, role, companyId, nots } = req.body;
    
    if (!firstName || !lastName || !username || !password || !phone || !role || !companyId) {
      res.status(400).json({ message: 'جميع الحقول مطلوبة' });
      return;
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserService.createUser({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      phone,
      role,
      companyId,
      nots
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'تم إنشاء المستخدم بنجاح'
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'اسم المستخدم أو رقم الهاتف موجود بالفعل'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المستخدم',
      error: error.message
    });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء استرجاع المستخدمين',
      error: error.message
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء استرجاع المستخدم',
      error: error.message
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // إذا تم تحديث كلمة المرور، قم بتشفيرها
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'تم تحديث المستخدم بنجاح'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المستخدم',
      error: error.message
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await UserService.deleteUser(req.params.id);
    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المستخدم',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    // 1. Check if username and password are provided
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide your username and password.'
      });
      return;
    }
    
    // 2. Verify if user exists in database
    const user = await UserService.getUserByUsername(username);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
      return;
    }
    
    // 3. Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
      return;
    }
    
    // 4. Generate JWT token only after successful verification
    const payload = {
      userId: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId,
      hashedPassword: user.password

    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'FinMaster$2025@SuperSecure!TokenKey_#8d92hs7s9d',
      { expiresIn: '24h' }
    );
    
    // 5. Prepare user response without sensitive data
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone,
      role: user.role,
      companyId: user.companyId,
      nots: user.nots
    };
    
    // 6. Set the token in the response header
    res.setHeader('Authorization', `Bearer ${token}`);
    
    // 7. Send success response with token and user data
    res.status(200).json({
      success: true,
      data: userResponse,

      token: token, 

      message: 'تم تسجيل الدخول بنجاح'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول',
      error: error.message
    });
  }



  
};