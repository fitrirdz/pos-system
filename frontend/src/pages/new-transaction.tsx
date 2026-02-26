import { useState } from "react";
import type { CartItem, Product, Transaction } from '../interfaces';
import PaymentModal from '../components/payment-modal';
import ReceiptModal from '../components/receipt-modal';
import ProductsCard from '../components/products-card';
import Cart from '../components/cart';
import { useToast } from '../context/use-toast';
import { useProducts } from '../hooks/use-products';
import { useCategories } from '../hooks/use-categories';
import { useCreateTransaction } from '../hooks/use-transactions';

export default function NewTransaction() {
    // Query hooks for data fetching
    const { data: products = [], isLoading: productsLoading } = useProducts();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    const {mutateAsync: createTransactionMutation, isPending} = useCreateTransaction();
    
    // Local state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const { showToast } = useToast();

    const isLoading = productsLoading || categoriesLoading;

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

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const handleConfirmPayment = async () => {
        // Prevent double submit
        if (isPending) return;

        try {
            const payload = {
                type: "SALE" as const,
                items: cart.map((item) => ({
                    code: item.code,
                    qty: item.qty,
                })),
            };

            const response = await createTransactionMutation(payload);
            const transactionData = response.data;

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
        }
    };

    // Show loading state while fetching initial data
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Products */}
            <div className="md:col-span-2">
                <ProductsCard
                    products={products}
                    categories={categories}
                    onAddToCart={addToCart}
                />
            </div>

            {/* Cart */}
            <Cart
                cart={cart}
                onCheckout={() => setShowPaymentModal(true)}
            />

            {showPaymentModal && (
                <PaymentModal
                    total={total}
                    loading={isPending}
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
