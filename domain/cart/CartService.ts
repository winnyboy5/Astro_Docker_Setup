import type { Product } from 'domain/product/Product';
import type { Cart } from './Cart';
import type { CartRepository } from './CartRepository';

export class CartService {
  constructor(private repository: CartRepository) {}

  async getAllCarts(): Promise<Cart[]> {
    return this.repository.getAll();
  }

  async getCartById(id: number): Promise<Cart | null> {
    return this.repository.getById(id);
  }

  async createCart(cart: Omit<Cart, 'id'>): Promise<Cart> {
    return this.repository.create(cart);
  }

  async updateCart(id: number, cart: Partial<Cart>): Promise<Cart | null> {
    return this.repository.update(id, cart);
  }

  async deleteCart(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  async addToCart(cartId: number, item: Product): Promise<Cart | null> {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error('Cart not found');

    const updatedProducts = [...cart.products];
    const existingProductIndex = updatedProducts.findIndex(p => p.id === item.id);
    
    if (existingProductIndex !== -1) {
      updatedProducts[existingProductIndex].quantity += item.quantity;
    } else {
      updatedProducts.push(item);
    }
    
    return this.updateCart(cartId, { products: updatedProducts });
  }

  async removeFromCart(cartId: number, productId: number): Promise<Cart | null> {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error('Cart not found');

    const updatedProducts = cart.products.filter(item => item.id !== productId);
    return this.updateCart(cartId, { products: updatedProducts });
  }

  async clearCart(cartId: number): Promise<Cart | null> {
    const emptyCart: Cart = {
      id: cartId,
      userId: 1, // Hardcoded for simplicity
      date: new Date().toISOString(),
      products: []
    };
    return this.updateCart(cartId, emptyCart);
  }
}