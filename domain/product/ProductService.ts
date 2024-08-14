import type { ProductRoot,Product } from './Product';
import type { ProductRepository } from './ProductRepository';

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async getAllProducts(): Promise<ProductRoot> {
    return this.repository.getAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.repository.getById(id);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return this.repository.create(product);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
    return this.repository.update(id, product);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}