
import type { Cart } from '../../../domain/cart/Cart';
import type { Product } from '../../../domain/product/Product';

describe('Cart', () => {
  let mockProduct: Product;
  let mockCart: Cart;

  beforeEach(() => {
    mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 9.99,
      description: 'This is a test product',
      category: 'Test Category',
      quantity: 1,
      images: ['http://example.com/image.jpg']
    };

    mockCart = {
      id: 1,
      userId: 1,
      date: '2023-05-17',
      products: [mockProduct]
    };
  });

  test('Cart should have correct structure', () => {
    expect(mockCart).toHaveProperty('id');
    expect(mockCart).toHaveProperty('userId');
    expect(mockCart).toHaveProperty('date');
    expect(mockCart).toHaveProperty('products');
  });

  test('Cart id should be a number', () => {
    expect(typeof mockCart.id).toBe('number');
  });

  test('Cart userId should be a number', () => {
    expect(typeof mockCart.userId).toBe('number');
  });

  test('Cart date should be a string', () => {
    expect(typeof mockCart.date).toBe('string');
  });

  test('Cart products should be an array', () => {
    expect(Array.isArray(mockCart.products)).toBe(true);
  });

  test('Cart products should contain Product objects', () => {
    mockCart.products.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('images');
    });
  });

  test('Cart should allow empty products array', () => {
    const emptyCart: Cart = { ...mockCart, products: [] };
    expect(emptyCart.products).toHaveLength(0);
  });

  test('Cart should allow multiple products', () => {
    const multiProductCart: Cart = {
      ...mockCart,
      products: [mockProduct, { ...mockProduct, id: 2 }]
    };
    expect(multiProductCart.products).toHaveLength(2);
  });
});