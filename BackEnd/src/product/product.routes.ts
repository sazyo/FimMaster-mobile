import { Router } from 'express';
import * as productController from './product.controller';

const router = Router();

// Get all products and create new product
router.route('/products')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

// Search products
router.route('/products/search')
  .get(productController.searchProducts);

// Get low stock products
router.route('/products/low-stock')
  .get(productController.getLowStockProducts);

// Get products by category
router.route('/products/category/:category')
  .get(productController.getProductsByCategory);

// Get products by supplier
router.route('/products/supplier/:supplierId')
  .get(productController.getProductsBySupplier);

// Get products by company
router.route('/products/company/:companyId')
  .get(productController.getProductsByCompany);

// Get, update, and delete product by ID
router.route('/products/:id')
  .get(productController.getProductById)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

// Update product quantity
router.route('/products/:id/quantity')
  .patch(productController.updateProductQuantity);

// Manage product suppliers
router.route('/products/:id/suppliers')
  .post(productController.addSupplierToProduct)
  .delete(productController.removeSupplierFromProduct);

export default router;
