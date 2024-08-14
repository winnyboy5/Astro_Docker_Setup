import { jest } from '@jest/globals';
import { ProductController } from '../../../app/ProductController';
import { ProductService } from '../../../domain/product/ProductService';
import type { Product, ProductRoot } from '../../../domain/product/Product';
import type{ ProductRepository } from '../../../domain/product/ProductRepository';

// Mock the ProductService
jest.mock('../../../domain/product/ProductService');
// Mock the ProductRepository
jest.mock('../../../domain/product/ProductRepository');

describe('ProductController', () => {
  let productController: ProductController;
  let mockProductService: jest.Mocked<ProductService>;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock ProductRepository
    mockProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProductRepository>;

    // Create a ProductService with the mock repository
    mockProductService = new ProductService(mockProductRepository) as jest.Mocked<ProductService>;

    // Create the ProductController with the mock ProductService
    productController = new ProductController(mockProductService);
  });

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 19.99,
    category: 'Test Category',
    description: 'Test Description',
    images: ['test-image.jpg'],
    quantity: 10
  };

  const mockProductRoot: ProductRoot = {
    products: [mockProduct]
  };

  const mockProductWithoutId: Omit<Product, 'id'> = {
    title: 'Test Product',
    price: 19.99,
    category: 'Test Category',
    description: 'Test Description',
    images: ['test-image.jpg'],
    quantity: 10
  };

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const mockProductRoot: ProductRoot = { products: [mockProduct] };
      jest.spyOn(mockProductService, 'getAllProducts').mockResolvedValue(mockProductRoot);
      const result = await productController.getAllProducts();
      expect(result).toEqual(mockProductRoot);
      expect(mockProductService.getAllProducts).toHaveBeenCalled();
    });
  });
  
  describe('getProductById', () => {
    it('should return a product when found', async () => {
      jest.spyOn(mockProductService, 'getProductById').mockResolvedValue(mockProduct);
      const result = await productController.getProductById(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
    });
  
    it('should throw an error when product is not found', async () => {
      jest.spyOn(mockProductService, 'getProductById').mockResolvedValue(null);
      await expect(productController.getProductById(1)).rejects.toThrow('Product not found');
    });
  });
  
  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      jest.spyOn(mockProductService, 'createProduct').mockResolvedValue(mockProduct);
      const result = await productController.createProduct(mockProductWithoutId);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(mockProductWithoutId);
    });
  });
  
  describe('updateProduct', () => {
    it('should update and return the product when found', async () => {
      const updateData: Partial<Product> = { price: 29.99 };
      const updatedProduct = { ...mockProduct, ...updateData };
      jest.spyOn(mockProductService, 'updateProduct').mockResolvedValue(updatedProduct);
      const result = await productController.updateProduct(1, updateData);
      expect(result).toEqual(updatedProduct);
      expect(mockProductService.updateProduct).toHaveBeenCalledWith(1, updateData);
    });
  
    it('should throw an error when product is not found', async () => {
      jest.spyOn(mockProductService, 'updateProduct').mockResolvedValue(null);
      await expect(productController.updateProduct(1, { price: 29.99 })).rejects.toThrow('Product not found');
    });
  });
  
  describe('deleteProduct', () => {
    it('should return success when product is deleted', async () => {
      jest.spyOn(mockProductService, 'deleteProduct').mockResolvedValue(true);
      const result = await productController.deleteProduct(1);
      expect(result).toEqual({ success: true });
      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
    });
  
    it('should throw an error when product is not found', async () => {
        jest.spyOn(mockProductService, 'deleteProduct').mockResolvedValue(false);
        await expect(productController.deleteProduct(1)).rejects.toThrow('Product not found');
      });
    });
    
    describe('error handling', () => {
      it('should propagate errors from ProductService in getAllProducts', async () => {
        const error = new Error('Database error');
        jest.spyOn(mockProductService, 'getAllProducts').mockRejectedValue(error);
        await expect(productController.getAllProducts()).rejects.toThrow('Database error');
      });
    
      it('should propagate errors from ProductService in getProductById', async () => {
        const error = new Error('Database error');
        jest.spyOn(mockProductService, 'getProductById').mockRejectedValue(error);
        await expect(productController.getProductById(1)).rejects.toThrow('Database error');
      });
    
      it('should propagate errors from ProductService in createProduct', async () => {
        const error = new Error('Database error');
        jest.spyOn(mockProductService, 'createProduct').mockRejectedValue(error);
        await expect(productController.createProduct({} as Omit<Product, 'id'>)).rejects.toThrow('Database error');
      });
    
      it('should propagate errors from ProductService in updateProduct', async () => {
        const error = new Error('Database error');
        jest.spyOn(mockProductService, 'updateProduct').mockRejectedValue(error);
        await expect(productController.updateProduct(1, {})).rejects.toThrow('Database error');
      });
    
      it('should propagate errors from ProductService in deleteProduct', async () => {
        const error = new Error('Database error');
        jest.spyOn(mockProductService, 'deleteProduct').mockRejectedValue(error);
        await expect(productController.deleteProduct(1)).rejects.toThrow('Database error');
      });
    });
    
  describe('input validation', () => {
    it('should throw an error when creating a product with negative price', async () => {
      const invalidProduct: Omit<Product, 'id'> = { 
        ...mockProductWithoutId, 
        price: -10 
      };
      await expect(productController.createProduct(invalidProduct)).rejects.toThrow('Invalid product data');
    });

    it('should throw an error when updating a product with invalid data', async () => {
      const invalidUpdate: Partial<Product> = { price: -10 };
      await expect(productController.updateProduct(1, invalidUpdate)).rejects.toThrow('Invalid product data');
    });

    it('should throw an error when getting a product with invalid id', async () => {
      await expect(productController.getProductById(-1)).rejects.toThrow('Invalid product id');
    });
  });
});