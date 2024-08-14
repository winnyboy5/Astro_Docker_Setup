import { ProductController } from '../../app/ProductController';
import { ProductService } from '../../domain/product/ProductService';
import { FakeStoreProductRepository } from '../../infra/repos/FakeStoreProductRepository';

const productRepository = new FakeStoreProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export async function get({ params }:any) {
  if (params.id) {
    return await productController.getProductById(parseInt(params.id));
  }
  return await productController.getAllProducts();
}

export async function post({ request }:any) {
  const product = await request.json();
  return await productController.createProduct(product);
}

export async function put({ params, request }:any) {
  const id = parseInt(params.id);
  const product = await request.json();
  return await productController.updateProduct(id, product);
}

export async function del({ params }:any) {
  const id = parseInt(params.id);
  return await productController.deleteProduct(id);
}