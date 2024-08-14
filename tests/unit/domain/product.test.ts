import type { Product, ProductRoot } from "../../../domain/product/Product";

describe('Product and ProductRoot interfaces', () => {
  let mockProduct: Product;
  let mockProductRoot: ProductRoot;

  beforeEach(() => {
    mockProduct = {
      id: 1,
      title: 'Test Product',
      price: 19.99,
      category: 'Electronics',
      description: 'This is a test product',
      images: ['image1.jpg', 'image2.jpg'],
      quantity: 5
    };

    mockProductRoot = {
      products: [mockProduct]
    };
  });

  describe('Product interface', () => {
    it('should have all required properties', () => {
      expect(mockProduct).toHaveProperty('id');
      expect(mockProduct).toHaveProperty('title');
      expect(mockProduct).toHaveProperty('price');
      expect(mockProduct).toHaveProperty('category');
      expect(mockProduct).toHaveProperty('description');
      expect(mockProduct).toHaveProperty('images');
      expect(mockProduct).toHaveProperty('quantity');
    });

    it('should have correct types for all properties', () => {
      expect(typeof mockProduct.id).toBe('number');
      expect(typeof mockProduct.title).toBe('string');
      expect(typeof mockProduct.price).toBe('number');
      expect(typeof mockProduct.category).toBe('string');
      expect(typeof mockProduct.description).toBe('string');
      expect(Array.isArray(mockProduct.images)).toBe(true);
      expect(typeof mockProduct.quantity).toBe('number');
    });

    it('should allow multiple images', () => {
      expect(mockProduct.images.length).toBeGreaterThan(0);
      mockProduct.images.forEach(image => {
        expect(typeof image).toBe('string');
      });
    });
  });

  describe('ProductRoot interface', () => {
    it('should have a products property', () => {
      expect(mockProductRoot).toHaveProperty('products');
    });

    it('products should be an array of Product objects', () => {
      expect(Array.isArray(mockProductRoot.products)).toBe(true);
      mockProductRoot.products.forEach(product => {
        expect(product).toMatchObject(mockProduct);
      });
    });

    it('should allow empty products array', () => {
      const emptyProductRoot: ProductRoot = { products: [] };
      expect(emptyProductRoot.products).toHaveLength(0);
    });

    it('should allow multiple products', () => {
      const multiProductRoot: ProductRoot = {
        products: [mockProduct, { ...mockProduct, id: 2 }]
      };
      expect(multiProductRoot.products).toHaveLength(2);
    });
  });
});