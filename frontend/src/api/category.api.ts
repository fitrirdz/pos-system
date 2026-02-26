import api from './axios';

export interface Category {
  id: string;
  name: string;
}

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};
