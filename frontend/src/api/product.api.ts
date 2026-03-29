import api from './axios';
import type { Product } from '../interfaces';

export interface ProductPayload {
  name: string;
  code: string;
  price: number;
  stock: number;
  categoryId?: string | number;
}

export interface GetProductsPaginatedParams {
  page: number;
  limit: number;
  search?: string;
}

export interface ProductsPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetProductsPaginatedResponse {
  data: Product[];
  pagination: ProductsPaginationMeta;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get('/products');
  return res.data;
};

export const getProductsPaginated = async (
  params: GetProductsPaginatedParams,
): Promise<GetProductsPaginatedResponse> => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const createProduct = async (data: ProductPayload) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id: string | number, data: ProductPayload) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string | number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
