import { type Cart } from './Cart';

export interface CartRepository {
  getAll(): Promise<Cart[]>;
  getById(id: number): Promise<Cart | null>;
  create(cart: Omit<Cart, 'id'>): Promise<Cart>;
  update(id: number, cart: Partial<Cart>): Promise<Cart | null>;
  delete(id: number): Promise<boolean>;
}