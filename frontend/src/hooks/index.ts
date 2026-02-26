/**
 * Central export point for all custom hooks
 * Makes imports cleaner: import { useProducts, useCategories } from '../hooks'
 */

export { useProducts, PRODUCTS_QUERY_KEY } from './use-products';
export { useCategories, CATEGORIES_QUERY_KEY } from './use-categories';
export { useCreateTransaction } from './use-transactions';
