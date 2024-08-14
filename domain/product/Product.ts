export interface ProductRoot {
  products: Product[]
}

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  quantity: number;
}