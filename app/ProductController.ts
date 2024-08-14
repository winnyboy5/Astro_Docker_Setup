import type { Product } from '../domain/product/Product';
import { ProductService } from '../domain/product/ProductService';

export class ProductController {
  constructor(private productService: ProductService) {}

  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  async createProduct(product: Omit<Product, 'id'>) {
    if (product.price < 0) {
      throw new Error('Invalid product data');
    }
    return this.productService.createProduct(product);
  }
  
  async updateProduct(id: number, product: Partial<Product>) {
    if (product.price !== undefined && product.price < 0) {
      throw new Error('Invalid product data');
    }
    const updatedProduct = await this.productService.updateProduct(id, product);
    if (!updatedProduct) throw new Error('Product not found');
    return updatedProduct;
  }
  
  async getProductById(id: number) {
    if (id < 0) {
      throw new Error('Invalid product id');
    }
    const product = await this.productService.getProductById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async deleteProduct(id: number) {
    const success = await this.productService.deleteProduct(id);
    if (!success) throw new Error('Product not found');
    return { success: true };
  }
}