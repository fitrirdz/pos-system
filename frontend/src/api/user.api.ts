import api from './axios';
import type { User } from '../interfaces';

export type UserRole = 'ADMIN' | 'CASHIER';

export interface CreateUserPayload {
  username: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get('/users');
  return res.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await api.post('/users', payload);
  return res.data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const res = await api.patch(`/users/${id}`, payload);
  return res.data;
};

export const deactivateUser = async (id: string): Promise<User> => {
  const res = await api.patch(`/users/${id}/deactivate`);
  return res.data;
};

export const updateUserRole = async (
  id: string,
  payload: UpdateUserRolePayload,
): Promise<User> => {
  const res = await api.patch(`/users/${id}/role`, payload);
  return res.data;
};

export const activateUser = async (id: string): Promise<User> => {
  const res = await api.patch(`/users/${id}/activate`);
  return res.data;
};
