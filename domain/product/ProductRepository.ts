import type { Product, ProductRoot } from './Product';

export interface ProductRepository {
  getAll(): Promise<ProductRoot>;
  getById(id: number): Promise<Product | null>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}