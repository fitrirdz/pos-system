import { useEffect, useState } from "react";
import type { CartItem, Product } from '../interfaces';
import api from '../api/axios';
import PaymentModal from '../components/payment-modal';
import { useToast } from '../context/use-toast';

export default function NewTransaction() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.code === product.code);

            if (existing) {
                return prev.map((item) =>
                    item.code === product.code
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });
    };

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
            const receiptId = response.data.data.id;

            // Reset cart and close modal
            setCart([]);
            setShowPaymentModal(false);

            // Show success toast with receipt ID
            showToast(`Transaction successful! Receipt ID: #${receiptId}`, "success");
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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="border rounded-xl p-4 hover:bg-blue-50 transition text-left"
                        >
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                                Rp {product.price.toLocaleString()}
                            </p>
                        </button>
                    ))}
                </div>
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
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition"
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
        </div>
    );
}
