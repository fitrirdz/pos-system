import { useState } from "react";

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
                            onChange={(e) =>
                                setPaidAmount(Number(e.target.value))
                            }
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                            autoFocus
                        />
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
