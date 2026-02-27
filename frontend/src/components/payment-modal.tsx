import { useState, useEffect } from "react";
import type { PaymentMethod } from "../interfaces";

type PaymentModalProps = {
    total: number;
    loading: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: PaymentMethod, paidAmount: number, change: number) => void;
};

export default function PaymentModal({
    total,
    loading,
    onClose,
    onConfirm,
}: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [paidAmount, setPaidAmount] = useState(0);

    const change = Math.max(paidAmount - total, 0);
    const isEnough = paidAmount >= total;

    // Keyboard shortcuts: Enter to confirm, ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "Enter" && isEnough && !loading) {
                onConfirm(paymentMethod, paidAmount, change);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEnough, loading, onClose, onConfirm, paymentMethod]);

    return (
        <div className="fixed -inset-4 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
                <h2 className="text-lg font-semibold mb-4">
                    Payment
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-bold">
                            Rp {total.toLocaleString()}
                        </span>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                        <label className="text-sm text-gray-500 mb-2 block">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("CASH")}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                                    paymentMethod === "CASH"
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                Cash
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod("DEBIT_CARD");
                                    setPaidAmount(total); // Auto-set exact amount
                                }}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                                    paymentMethod === "DEBIT_CARD"
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                Debit
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod("CREDIT_CARD");
                                    setPaidAmount(total); // Auto-set exact amount
                                }}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                                    paymentMethod === "CREDIT_CARD"
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                Credit
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod("QRIS");
                                    setPaidAmount(total); // Auto-set exact amount
                                }}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                                    paymentMethod === "QRIS"
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                QRIS
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod("E_WALLET");
                                    setPaidAmount(total); // Auto-set exact amount for e-wallet
                                }}
                                className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                                    paymentMethod === "E_WALLET"
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                E-Wallet
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">
                            Paid Amount
                        </label>
                        <input
                            type="number"
                            value={paidAmount || ''}
                            onChange={(e) =>
                                setPaidAmount(Number(e.target.value))
                            }
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            autoFocus
                            disabled={paymentMethod !== "CASH"}
                        />
                        
                        {/* Quick cash buttons - only show for CASH payment */}
                        {paymentMethod === "CASH" && (
                            <div className="grid grid-cols-4 gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setPaidAmount((prev) => prev + 10000)}
                                className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium"
                            >
                                10k
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaidAmount((prev) => prev + 20000)}
                                className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium"
                            >
                                20k
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaidAmount((prev) => prev + 50000)}
                                className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium"
                            >
                                50k
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaidAmount(total)}
                                className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium"
                            >
                                Exact
                            </button>
                        </div>
                        )}
                    </div>

                    <div className="flex justify-between text-lg font-semibold">
                        <span>Change</span>
                        <span>
                            Rp {change.toLocaleString()}
                        </span>
                    </div>

                    {!isEnough && paidAmount > 0 && (
                        <p className="text-sm text-red-500">
                            Paid amount is not enough.
                        </p>
                    )}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(paymentMethod, paidAmount, change)}
                        disabled={!isEnough || loading}
                        className="flex-1 bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white py-2 rounded-lg font-semibold"
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}
