export interface MenuItem {
  label: string;
  path: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

export interface CartItem extends Product {
  qty: number;
}
