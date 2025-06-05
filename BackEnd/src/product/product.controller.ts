import { Request, Response } from 'express';
import * as productService from './product.service';
import Product from './product.model';
import mongoose from 'mongoose';

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.fetchAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.userId || !productData.companyId) {
      res.status(400).json({ error: 'User ID and Company ID are required' });
      return;
    }

    const newProduct = await productService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    
    // Validate required fields if they are being updated
    if (productData.userId === null || productData.companyId === null) {
      res.status(400).json({ error: 'User ID and Company ID cannot be null' });
      return;
    }
    
    const updatedProduct = await productService.updateProduct(productId, productData);
    
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const deletedProduct = await productService.deleteProduct(productId);
    
    if (!deletedProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    
    const products = await productService.searchProducts(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params.category;
    const products = await productService.getProductsByCategory(category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by category' });
  }
};

// Get products by supplier
export const getProductsBySupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierId = req.params.supplierId;
    const products = await productService.getProductsBySupplier(supplierId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by supplier' });
  }
};

// Get products by company
export const getProductsByCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = req.params.companyId;
    if (!companyId) {
      res.status(400).json({ error: 'معرف الشركة مطلوب' });
      return;
    }
    const products = await productService.getProductsByCompany(companyId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب منتجات الشركة' });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getLowStockProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
};

// Update product quantity
export const updateProductQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const { quantityChange } = req.body;
    
    if (typeof quantityChange !== 'number') {
      res.status(400).json({ error: 'Quantity change must be a number' });
      return;
    }
    
    const updatedProduct = await productService.updateProductQuantity(productId, quantityChange);
    
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product quantity' });
  }
};

// Add supplier to product
export const addSupplierToProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const { supplierId } = req.body;
    
    if (!supplierId) {
      res.status(400).json({ error: 'Supplier ID is required' });
      return;
    }
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    // Check if supplier already exists in the product's supplier list
    if (product.supplierIds.includes(new mongoose.Types.ObjectId(supplierId))) {
      res.status(400).json({ error: 'Supplier already added to this product' });
      return;
    }
    
    // Add the supplier to the product's supplier list
    product.supplierIds.push(new mongoose.Types.ObjectId(supplierId));
    await product.save();
    
    res.status(200).json(product);
  } catch (error: any) {
    console.error('Error adding supplier to product:', error);
    res.status(500).json({ error: 'Failed to add supplier to product', details: error.message });
  }
};

// Remove supplier from product
export const removeSupplierFromProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const { supplierId } = req.body;
    
    if (!supplierId) {
      res.status(400).json({ error: 'Supplier ID is required' });
      return;
    }
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    // Check if supplier exists in the product's supplier list
    const supplierObjectId = new mongoose.Types.ObjectId(supplierId);
    const supplierIndex = product.supplierIds.findIndex(
      (id) => id.equals(supplierObjectId)
    );
    
    if (supplierIndex === -1) {
      res.status(404).json({ error: 'Supplier not found in product\'s supplier list' });
      return;
    }
    
    // Remove the supplier from the product's supplier list
    product.supplierIds.splice(supplierIndex, 1);
    await product.save();
    
    res.status(200).json(product);
  } catch (error: any) {
    console.error('Error removing supplier from product:', error);
    res.status(500).json({ error: 'Failed to remove supplier from product', details: error.message });
  }
};
