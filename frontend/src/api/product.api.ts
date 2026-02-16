import api from './axios';

export interface ProductPayload {
  name: string;
  code: string;
  price: number;
  stock: number;
  categoryId?: number;
}

export const getProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const createProduct = async (data: ProductPayload) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id: number, data: ProductPayload) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
