// src/api/cart.ts
import { CartController } from '../../app/CartController';
import { CartService } from '../../domain/cart/CartService';
import { FakeStoreCartRepository } from '../../infra/repos/FakeStoreCartRepository';

const cartRepository = new FakeStoreCartRepository();
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

export async function post({ request }:any) {
    const { id, quantity } = await request.json();
    
    // For simplicity, we'll use a hardcoded cartId. In a real application, you'd get this from the user's session.
    const cartId = 1;
    
    try {
      const updatedCart = await cartController.addToCart(cartId, {
          id, quantity,
          title: '',
          price: 0,
          category: '',
          description: '',
          images: []
      });
      
      return new Response(JSON.stringify({ success: true, cart: updatedCart }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to add item to cart' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  export async function del({ params }: any) {
    const productId = parseInt(params.id);
    const cartId = 1; // Hardcoded for simplicity
  
    try {
      const updatedCart = await cartController.removeFromCart(cartId, productId);
      
      return new Response(JSON.stringify({ success: true, cart: updatedCart }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to remove item from cart' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
  export async function clearCart() {
    const cartId = 1; // Hardcoded for simplicity
  
    try {
      const clearedCart = await cartController.clearCart(cartId);
      
      return new Response(JSON.stringify({ success: true, cart: clearedCart }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to clear cart' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  
