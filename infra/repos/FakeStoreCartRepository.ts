import type { Cart } from '../../domain/cart/Cart';
import type { CartRepository } from '../../domain/cart/CartRepository';

export class FakeStoreCartRepository implements CartRepository {
  private baseUrl = 'https://dummyjson.com/carts';

  async getAll(): Promise<Cart[]> {
    const response = await fetch(`${this.baseUrl}`);
    return response.json();
  }

  async getById(id: number): Promise<Cart | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (response.status === 404) return null;
    return response.json();
  }

  async create(cart: Omit<Cart, 'id'>): Promise<Cart> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(cart),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async update(id: number, cart: Partial<Cart>): Promise<Cart | null> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cart),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 404) return null;
    return response.json();
  }

  async delete(id: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    return response.status === 200;
  }

  async clearCart(cartId: number): Promise<Cart> {
    const emptyCart: Cart = {
      id: cartId,
      userId: 1, // Hardcoded for simplicity
      date: new Date().toISOString(),
      products: []
    };
    
    const response = await fetch(`${this.baseUrl}/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emptyCart)
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return emptyCart;
  }
}