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

export const createTransaction = async (data: CreateTransactionPayload) => {
  const res = await api.post('/transactions', data);
  return res.data;
};

export const getTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data;
};
