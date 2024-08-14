import type { ProductRoot, Product } from '../../domain/product/Product';
import type { ProductRepository } from '../../domain/product/ProductRepository';

export class FakeStoreProductRepository implements ProductRepository {
  private baseUrl = 'https://dummyjson.com/products';

  async getAll(): Promise<ProductRoot> {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  async getById(id: number): Promise<Product | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (response.status === 404) return null;
    return response.json();
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 404) return null;
    return response.json();
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    return response.status === 200;
  }
}