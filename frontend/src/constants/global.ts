import type { MenuItem } from '../interfaces';

export const ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Transactions', path: '/admin/transactions' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Users', path: '/admin/users' },
];

export const CASHIER_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/cashier/dashboard' },
  { label: 'Transactions', path: '/cashier/transactions' },
];
