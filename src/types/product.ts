export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Size {
  id: string;
  name: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  sizes: Size[];
}

export interface CartItem {
  categoryId: string;
  categoryName: string;
  sizeId: string;
  sizeName: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
