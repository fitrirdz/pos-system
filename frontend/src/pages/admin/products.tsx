import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductPayload,
} from '../../api/product.api';
import {
  useProductsPaginated,
  PRODUCTS_PAGINATED_QUERY_KEY,
  PRODUCTS_QUERY_KEY,
} from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { useToast } from '../../context/use-toast';
import type { Product } from '../../interfaces';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

type FormState = {
  code: string;
  name: string;
  price: string;
  stock: string;
  categoryId: string;
};

const defaultFormState: FormState = {
  code: '',
  name: '',
  price: '',
  stock: '',
  categoryId: '',
};

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useProductsPaginated({
    page: currentPage,
    limit: pageSize,
    search: search || undefined,
  });

  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;
  const totalProducts = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const safeCurrentPage = pagination?.page ?? currentPage;
  const startIndex = (safeCurrentPage - 1) * pageSize;

  const { data: categories = [] } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(defaultFormState);

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_PAGINATED_QUERY_KEY });
      showToast('Product created successfully', 'success');
      closeModal();
    },
    onError: () => {
      showToast('Failed to create product', 'error');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_PAGINATED_QUERY_KEY });
      showToast('Product updated successfully', 'success');
      closeModal();
    },
    onError: () => {
      showToast('Failed to update product', 'error');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_PAGINATED_QUERY_KEY });
      showToast('Product deleted successfully', 'success');
    },
    onError: () => {
      showToast('Failed to delete product', 'error');
    },
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!isLoadingProducts && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, isLoadingProducts, totalPages]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(defaultFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      code: product.code,
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: String(product.categoryId),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(defaultFormState);
  };

  const handleFormChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = () => {
    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.price.trim() ||
      !form.stock.trim() ||
      !form.categoryId.trim()
    ) {
      showToast('Please complete all product fields', 'error');
      return;
    }

    const parsedPrice = Number(form.price);
    const parsedStock = Number(form.stock);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedStock)) {
      showToast('Price and stock must be valid numbers', 'error');
      return;
    }

    if (parsedPrice < 0 || parsedStock < 0) {
      showToast('Price and stock cannot be negative', 'error');
      return;
    }

    const payload: ProductPayload = {
      code: form.code.trim(),
      name: form.name.trim(),
      price: parsedPrice,
      stock: parsedStock,
      categoryId: form.categoryId,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, payload });
      return;
    }

    createProductMutation.mutate(payload);
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `Delete product ${product.name} (${product.code})?`,
    );

    if (!confirmed) {
      return;
    }

    deleteProductMutation.mutate(product.id);
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white p-6 rounded-xl shadow'>
        <h1 className='text-2xl font-bold'>📦 Products</h1>
        <p className='text-gray-500 mt-2'>
          Manage product catalog and inventory
        </p>
      </div>

      <div className='bg-white p-6 rounded-xl shadow space-y-4'>
        <div className='flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
          <div className='w-full md:max-w-md'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Search by Code or Name
            </label>
            <input
              type='text'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='e.g. BRG001 or Milk'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div className='flex flex-col md:flex-row gap-3 md:items-end'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Show Data
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openAddModal}
              className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition'
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[800px]'>
            <thead className='border-b'>
              <tr className='text-left text-sm text-gray-600'>
                <th className='py-3 font-semibold w-16'>No</th>
                <th className='py-3 font-semibold'>Code</th>
                <th className='py-3 font-semibold'>Name</th>
                <th className='py-3 font-semibold'>Price</th>
                <th className='py-3 font-semibold'>Stock</th>
                <th className='py-3 font-semibold'>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProducts ? (
                <tr>
                  <td colSpan={6} className='py-8 text-center text-gray-500'>
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className='py-8 text-center text-gray-500'>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product: Product, index) => (
                  <tr key={product.id} className='border-b last:border-0'>
                    <td className='py-3 text-sm text-gray-700'>
                      {startIndex + index + 1}
                    </td>
                    <td className='py-3 text-sm font-mono text-gray-900'>
                      {product.code}
                    </td>
                    <td className='py-3 text-sm text-gray-900'>
                      {product.name}
                    </td>
                    <td className='py-3 text-sm text-gray-900'>
                      {formatCurrency(product.price)}
                    </td>
                    <td className='py-3 text-sm text-gray-900'>
                      {product.stock}
                    </td>
                    <td className='py-3'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => openEditModal(product)}
                          className='px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className='px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='flex items-center justify-between pt-2'>
          <p className='text-sm text-gray-500'>
            Showing {products.length} of {totalProducts} products
            {isFetchingProducts ? ' (updating...)' : ''}
          </p>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              className='px-3 py-1.5 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              Previous
            </button>
            <span className='text-sm text-gray-600'>
              Page {safeCurrentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={safeCurrentPage === totalPages}
              className='px-3 py-1.5 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed -inset-4 bg-black/40 z-50 flex items-center justify-center p-4'>
          <div className='w-full max-w-lg bg-white rounded-xl shadow-xl p-6 space-y-4'>
            <h2 className='text-xl font-bold'>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Code
                </label>
                <input
                  type='text'
                  value={form.code}
                  onChange={(e) => handleFormChange('code', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input
                  type='text'
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Price
                </label>
                <input
                  type='number'
                  min={0}
                  value={form.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Stock
                </label>
                <input
                  type='number'
                  min={0}
                  value={form.stock}
                  onChange={(e) => handleFormChange('stock', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>
            {!editingProduct && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    handleFormChange('categoryId', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  <option value=''>Select category</option>
                  {categories.map((category: { id: string; name: string }) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className='flex justify-end gap-2 pt-2'>
              <button
                onClick={closeModal}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
                className='px-4 py-2 bg-primary text-white rounded-lg font-semibold disabled:opacity-60'
              >
                {createProductMutation.isPending ||
                updateProductMutation.isPending
                  ? 'Saving...'
                  : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
