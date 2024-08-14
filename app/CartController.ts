import { CartService } from '../domain/cart/CartService';
import type { Cart } from '../domain/cart/Cart';
import type { Product } from 'domain/product/Product';

export class CartController {
  constructor(private cartService: CartService) {}

  async getAllCarts() {
    return this.cartService.getAllCarts();
  }

  async getCartById(id: number) {
    const cart = await this.cartService.getCartById(id);
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  async createCart(cart: Omit<Cart, 'id'>) {
    return this.cartService.createCart(cart);
  }

  async updateCart(id: number, cart: Partial<Cart>) {
    const updatedCart = await this.cartService.updateCart(id, cart);
    if (!updatedCart) throw new Error('Cart not found');
    return updatedCart;
  }

  async deleteCart(id: number) {
    const success = await this.cartService.deleteCart(id);
    if (!success) throw new Error('Cart not found');
    return { success: true };
  }

  async addToCart(cartId: number, item: Product): Promise<Cart> {
    const cart = await this.getCartById(cartId);
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
    return this.cartService.removeFromCart(cartId, productId);
  }

  async clearCart(cartId: number): Promise<Cart | null> {
    return this.cartService.clearCart(cartId);
  }
}