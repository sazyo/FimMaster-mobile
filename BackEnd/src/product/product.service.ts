import Product, { ProductDocument } from './product.model';
import mongoose from 'mongoose';

// Get all products
export const fetchAllProducts = async (): Promise<ProductDocument[]> => {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductDocument | null> => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw new Error(`Failed to fetch product with ID: ${id}`);
  }
};

// Create new product
export const createProduct = async (productData: Partial<ProductDocument>): Promise<ProductDocument> => {
  try {
    if (!productData.userId || !productData.companyId) {
      throw new Error('معرف المستخدم والشركة مطلوبان');
    }
    const newProduct = new Product(productData);
    return await newProduct.save();
  } catch (error) {
    throw new Error('فشل في إنشاء المنتج');
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<ProductDocument>): Promise<ProductDocument | null> => {
  try {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  } catch (error) {
    throw new Error(`Failed to update product with ID: ${id}`);
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<ProductDocument | null> => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Failed to delete product with ID: ${id}`);
  }
};

// Search products by name, category, or barcode
export const searchProducts = async (query: string): Promise<ProductDocument[]> => {
  try {
    return await Product.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } }
      ]
    });
  } catch (error) {
    throw new Error(`Failed to search products with query: ${query}`);
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<ProductDocument[]> => {
  try {
    return await Product.find({ category });
  } catch (error) {
    throw new Error(`Failed to fetch products in category: ${category}`);
  }
};

// Get products by supplier
export const getProductsBySupplier = async (supplierId: string): Promise<ProductDocument[]> => {
  try {
    return await Product.find({ supplierIds: supplierId });
  } catch (error) {
    throw new Error(`Failed to fetch products for supplier: ${supplierId}`);
  }
};

// Get products by company
export const getProductsByCompany = async (companyId: string): Promise<ProductDocument[]> => {
  try {
    return await Product.find({ companyId });
  } catch (error) {
    throw new Error(`فشل في جلب منتجات الشركة: ${companyId}`);
  }
};

// Get low stock products
export const getLowStockProducts = async (): Promise<ProductDocument[]> => {
  try {
    return await Product.find({
      $expr: { $lte: ["$quantity", "$minQuantity"] }
    });
  } catch (error) {
    throw new Error('Failed to fetch low stock products');
  }
};

// Update product quantity
export const updateProductQuantity = async (
  id: string, 
  quantityChange: number
): Promise<ProductDocument | null> => {
  try {
    const product = await Product.findById(id);
    if (!product) return null;
    
    product.quantity += quantityChange;
    return await product.save();
  } catch (error) {
    throw new Error(`Failed to update quantity for product with ID: ${id}`);
  }
};
