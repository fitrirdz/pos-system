import { useState, useRef, useEffect } from "react";
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
    const [paymentDetails, setPaymentDetails] = useState<{ paidAmount: number; change: number } | null>(null);
    const [barcodeInput, setBarcodeInput] = useState("");
    const barcodeRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    // Auto-focus barcode input when modal is closed
    useEffect(() => {
        if (!showPaymentModal && barcodeRef.current) {
            barcodeRef.current.focus();
        }
    }, [showPaymentModal]);

    const isLoading = productsLoading || categoriesLoading;

    const addToCart = (product: Product): boolean => {
        // Prevent adding out of stock items
        if (product.stock === 0) {
            showToast("Product is out of stock", "error");
            return false;
        }

        // Check if item already exists in cart and would exceed stock
        const existing = cart.find((item) => item.code === product.code);
        if (existing && existing.qty >= product.stock) {
            showToast(`Only ${product.stock} items available in stock`, "error");
            return false;
        }

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
        
        return true;
    };

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!barcodeInput.trim()) return;

        // Find product by code
        const product = products.find((p: Product) => p.code === barcodeInput.trim());

        if (product) {
            const success = addToCart(product);
            if (success) {
                showToast(`Added ${product.name} to cart`, "success");
            }
        } else {
            showToast(`Product with code "${barcodeInput}" not found`, "error");
        }

        // Clear input and refocus
        setBarcodeInput("");
        barcodeRef.current?.focus();
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const handleConfirmPayment = async (paidAmount: number, change: number) => {
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

            // Store transaction data and payment details
            setTransaction(transactionData);
            setPaymentDetails({ paidAmount, change });

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
        <div className="space-y-4 h-full flex flex-col">
            {/* Barcode Scanner Input */}
            <form onSubmit={handleBarcodeSubmit} className="flex-shrink-0">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scan Barcode or Enter Product Code
                    </label>
                    <input
                        ref={barcodeRef}
                        type="text"
                        value={barcodeInput}
                        onChange={(e) => setBarcodeInput(e.target.value)}
                        placeholder="Scan or type product code..."
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        autoFocus
                    />
                </div>
            </form>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
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
            </div>

            {showPaymentModal && (
                <PaymentModal
                    total={total}
                    loading={isPending}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handleConfirmPayment}
                />
            )}

            {transaction && paymentDetails && (
                <ReceiptModal
                    transaction={transaction}
                    paidAmount={paymentDetails.paidAmount}
                    change={paymentDetails.change}
                    onClose={() => {
                        setTransaction(null);
                        setPaymentDetails(null);
                    }}
                />
            )}
        </div>
    );
}
