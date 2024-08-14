import { jest } from '@jest/globals';
import { CartController } from '../../../app/CartController';
import { CartService } from '../../../domain/cart/CartService';
import type { Cart } from '../../../domain/cart/Cart';
import type { Product } from '../../../domain/product/Product';

describe('CartController', () => {
  let cartController: CartController;
  let mockCartService: jest.Mocked<CartService>;

  const mockCart: Cart = {
    id: 1,
    userId: 1,
    date: '2023-05-17',
    products: []
  };

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 19.99,
    category: 'Test Category',
    description: 'Test Description',
    images: ['test-image.jpg'],
    quantity: 1
  };

  beforeEach(() => {
    mockCartService = {
      getAllCarts: jest.fn(),
      getCartById: jest.fn(),
      createCart: jest.fn(),
      updateCart: jest.fn(),
      deleteCart: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn()
    } as unknown as jest.Mocked<CartService>;

    cartController = new CartController(mockCartService);
  });

  describe('getAllCarts', () => {
    it('should return all carts', async () => {
      mockCartService.getAllCarts.mockResolvedValue([mockCart]);
      const result = await cartController.getAllCarts();
      expect(result).toEqual([mockCart]);
      expect(mockCartService.getAllCarts).toHaveBeenCalled();
    });
  });

  describe('getCartById', () => {
    it('should return a cart when found', async () => {
      mockCartService.getCartById.mockResolvedValue(mockCart);
      const result = await cartController.getCartById(1);
      expect(result).toEqual(mockCart);
      expect(mockCartService.getCartById).toHaveBeenCalledWith(1);
    });

    it('should throw an error when cart is not found', async () => {
      mockCartService.getCartById.mockResolvedValue(null);
      await expect(cartController.getCartById(1)).rejects.toThrow('Cart not found');
    });
  });

  describe('createCart', () => {
    it('should create and return a new cart', async () => {
      const newCart: Omit<Cart, 'id'> = { userId: 1, date: '2023-05-17', products: [] };
      mockCartService.createCart.mockResolvedValue({ ...newCart, id: 1 });
      const result = await cartController.createCart(newCart);
      expect(result).toEqual({ ...newCart, id: 1 });
      expect(mockCartService.createCart).toHaveBeenCalledWith(newCart);
    });
  });

  describe('updateCart', () => {
    it('should update and return the cart when found', async () => {
      const updateData: Partial<Cart> = { userId: 2 };
      const updatedCart = { ...mockCart, ...updateData };
      mockCartService.updateCart.mockResolvedValue(updatedCart);
      const result = await cartController.updateCart(1, updateData);
      expect(result).toEqual(updatedCart);
      expect(mockCartService.updateCart).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw an error when cart is not found', async () => {
      mockCartService.updateCart.mockResolvedValue(null);
      await expect(cartController.updateCart(1, { userId: 2 })).rejects.toThrow('Cart not found');
    });
  });

  describe('deleteCart', () => {
    it('should return success when cart is deleted', async () => {
      mockCartService.deleteCart.mockResolvedValue(true);
      const result = await cartController.deleteCart(1);
      expect(result).toEqual({ success: true });
      expect(mockCartService.deleteCart).toHaveBeenCalledWith(1);
    });

    it('should throw an error when cart is not found', async () => {
      mockCartService.deleteCart.mockResolvedValue(false);
      await expect(cartController.deleteCart(1)).rejects.toThrow('Cart not found');
    });
  });

  describe('addToCart', () => {
    it('should add a new product to the cart', async () => {
      const cartWithProduct = { ...mockCart, products: [mockProduct] };
      mockCartService.getCartById.mockResolvedValue(mockCart);
      mockCartService.updateCart.mockResolvedValue(cartWithProduct);

      const result = await cartController.addToCart(1, mockProduct);
      expect(result).toEqual(cartWithProduct);
      expect(mockCartService.updateCart).toHaveBeenCalledWith(1, { products: [mockProduct] });
    });

    it('should increase quantity if product already exists in cart', async () => {
      const existingProduct = { ...mockProduct, quantity: 1 };
      const cartWithExistingProduct = { ...mockCart, products: [existingProduct] };
      mockCartService.getCartById.mockResolvedValue(cartWithExistingProduct);
      
      const updatedProduct = { ...existingProduct, quantity: 2 };
      const updatedCart = { ...cartWithExistingProduct, products: [updatedProduct] };
      mockCartService.updateCart.mockResolvedValue(updatedCart);

      const result = await cartController.addToCart(1, mockProduct);
      expect(result).toEqual(updatedCart);
      expect(mockCartService.updateCart).toHaveBeenCalledWith(1, { products: [updatedProduct] });
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from the cart', async () => {
      const updatedCart = { ...mockCart, products: [] };
      mockCartService.removeFromCart.mockResolvedValue(updatedCart);

      const result = await cartController.removeFromCart(1, 1);
      expect(result).toEqual(updatedCart);
      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1, 1);
    });

    it('should return null if cart is not found', async () => {
      mockCartService.removeFromCart.mockResolvedValue(null);
      const result = await cartController.removeFromCart(1, 1);
      expect(result).toBeNull();
    });
  });

  describe('clearCart', () => {
    it('should clear all products from the cart', async () => {
      const clearedCart = { ...mockCart, products: [] };
      mockCartService.clearCart.mockResolvedValue(clearedCart);

      const result = await cartController.clearCart(1);
      expect(result).toEqual(clearedCart);
      expect(mockCartService.clearCart).toHaveBeenCalledWith(1);
    });

    it('should return null if cart is not found', async () => {
      mockCartService.clearCart.mockResolvedValue(null);
      const result = await cartController.clearCart(1);
      expect(result).toBeNull();
    });
  });
});