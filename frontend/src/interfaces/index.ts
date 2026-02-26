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

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  qty: number;
  price: number;
  product: {
    id: string;
    code: string;
    name: string;
    price: number;
  };
}

export interface Transaction {
  id: string;
  type: string;
  subtotal: number;
  discountTotal: number;
  tax: number;
  total: number;
  userId: string;
  cashier: User;
  createdAt: string;
  items: TransactionItem[];
}
