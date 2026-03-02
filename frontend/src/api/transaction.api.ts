import api from './axios';
import type { PaymentMethod } from '../interfaces';

export interface TransactionItem {
  code: string;
  qty: number;
}

export interface CreateTransactionPayload {
  type: 'STOCK_IN' | 'SALE';
  items: TransactionItem[];
  paymentMethod?: PaymentMethod;
  paidAmount?: number;
}

export interface GetTransactionsFilters {
  userId?: string;
  date?: string;
  search?: string;
  type?: 'SALE' | 'STOCK_IN' | '';
}

export const createTransaction = async (data: CreateTransactionPayload) => {
  const res = await api.post('/transactions', data);
  return res.data;
};

export const getTransactions = async (filters?: GetTransactionsFilters) => {
  const params: Record<string, string> = {};
  
  if (filters?.userId) params.userId = filters.userId;
  if (filters?.date) params.date = filters.date;
  if (filters?.search) params.search = filters.search;
  if (filters?.type) params.type = filters.type;
  
  const res = await api.get('/transactions', { params });
  return res.data;
};