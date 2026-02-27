import { useState, useEffect } from "react";

type PaymentModalProps = {
    total: number;
    loading: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function PaymentModal({
    total,
    loading,
    onClose,
    onConfirm,
}: PaymentModalProps) {
    const [paidAmount, setPaidAmount] = useState(0);

    const change = Math.max(paidAmount - total, 0);
    const isEnough = paidAmount >= total;

    // Keyboard shortcuts: Enter to confirm, ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "Enter" && isEnough && !loading) {
                onConfirm();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEnough, loading, onClose, onConfirm]);

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
                        />
                        
                        {/* Quick cash buttons */}
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
                        onClick={onConfirm}
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
