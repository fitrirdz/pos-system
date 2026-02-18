import type { MenuItem } from '../interfaces';

export const ADMIN_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Products', path: '/products' },
  { label: 'Reports', path: '/reports' },
  { label: 'Users', path: '/users' },
];

export const CASHIER_MENU: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transactions', path: '/transactions' },
];
