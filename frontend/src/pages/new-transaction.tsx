import { useEffect, useState } from "react";
import type { CartItem, Product, Transaction } from '../interfaces';
import api from '../api/axios';
import { getCategories, type Category } from '../api/category.api';
import PaymentModal from '../components/payment-modal';
import ReceiptModal from '../components/receipt-modal';
import { useToast } from '../context/use-toast';

export default function NewTransaction() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get("/products"),
                    getCategories(),
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    const addToCart = (product: Product) => {
        // Prevent adding out of stock items
        if (product.stock === 0) {
            showToast("Product is out of stock", "error");
            return;
        }

        setCart((prev) => {
            const existing = prev.find((item) => item.code === product.code);

            if (existing) {
                // Check if adding one more would exceed stock
                if (existing.qty >= product.stock) {
                    showToast(`Only ${product.stock} items available in stock`, "error");
                    return prev;
                }

                return prev.map((item) =>
                    item.code === product.code
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
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

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const handleConfirmPayment = async () => {
        // Prevent double submit
        if (loading) return;

        try {
            setLoading(true);

            const payload = {
                type: "SALE",
                items: cart.map((item) => ({
                    code: item.code,
                    qty: item.qty,
                })),
            };

            const response = await api.post("/transactions", payload);
            const transactionData = response.data.data;

            // Store transaction data
            setTransaction(transactionData);

            // Reset cart and close payment modal
            setCart([]);
            setShowPaymentModal(false);

            // Show success toast
            showToast(`Transaction successful! Receipt ID: #${transactionData.id}`, "success");
        } catch (error) {
            console.error("Transaction failed", error);
            const errorMessage = error instanceof Error ? error.message : "Transaction failed!";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Products */}
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
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
                                onClick={() => addToCart(product)}
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

            {/* Cart */}
            <div className="bg-white p-6 rounded-xl shadow flex flex-col">
                <h2 className="text-lg font-semibold mb-4">
                    Cart
                </h2>

                <div className="flex-1 space-y-3 overflow-auto">
                    {cart.length === 0 && (
                        <p className="text-sm text-gray-400">
                            No items yet
                        </p>
                    )}

                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Rp {item.price.toLocaleString()}
                                </p>
                            </div>

                            <span>x {item.qty}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString()}</span>
                    </div>

                    <button
                        onClick={() => setShowPaymentModal(true)}
                        disabled={cart.length === 0}
                        className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Process Payment
                    </button>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    total={total}
                    loading={loading}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handleConfirmPayment}
                />
            )}

            {transaction && (
                <ReceiptModal
                    transaction={transaction}
                    onClose={() => setTransaction(null)}
                />
            )}
        </div>
    );
}
