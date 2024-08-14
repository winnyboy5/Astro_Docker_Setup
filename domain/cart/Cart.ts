import type { Product } from "domain/product/Product";

  export interface Cart {
    id: number;
    userId: number;
    date: string;
    products: Product[];
  }