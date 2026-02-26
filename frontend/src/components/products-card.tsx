import { useState } from "react";
import type { Product } from '../interfaces';
import type { Category } from '../api/category.api';
import { useToast } from '../context/use-toast';

interface ProductsCardProps {
    products: Product[];
    categories: Category[];
    onAddToCart: (product: Product) => void;
}

export default function ProductsCard({ products, categories, onAddToCart }: ProductsCardProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const { showToast } = useToast();

    const handleAddToCart = (product: Product) => {
        if (product.stock === 0) {
            showToast("Product is out of stock", "error");
            return;
        }
        onAddToCart(product);
    };

    // Filter products based on search and category
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory
            ? product.categoryId === selectedCategory
            : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
                Products
            </h2>

            {/* Search and Filter */}
            <div className="mb-4 flex flex-col md:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                    const isOutOfStock = product.stock === 0;
                    return (
                        <button
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            disabled={isOutOfStock}
                            className={`border rounded-xl p-4 transition text-left ${
                                isOutOfStock
                                    ? "bg-gray-100 cursor-not-allowed opacity-60"
                                    : "hover:bg-primary-light"
                            }`}
                        >
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                                Rp {product.price.toLocaleString()}
                            </p>
                            <p className={`text-xs mt-1 ${
                                isOutOfStock ? "text-red-500" : "text-gray-600"
                            }`}>
                                Stock: {product.stock}
                                {isOutOfStock && " (Out of Stock)"}
                            </p>
                        </button>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-gray-400 mt-8">
                    No products found
                </p>
            )}
        </div>
    );
}
