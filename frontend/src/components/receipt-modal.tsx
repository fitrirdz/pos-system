import { useRef } from 'react';
import type { Transaction } from '../interfaces';

interface ReceiptModalProps {
    transaction: Transaction;
    onClose: () => void;
}

export default function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'medium',
        }).format(new Date(dateString));
    };

    return (
        <>
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                    {/* Modal Header */}
                    <div className="border-b px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Receipt Preview</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Receipt Content (visible in modal) */}
                    <div className="p-6 max-h-96 overflow-auto">
                        <div ref={printRef} className="receipt-content">
                            {/* Receipt Header */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold">POS System</h1>
                                <p className="text-sm text-gray-600 mt-1">Receipt #{transaction.id}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.createdAt)}</p>
                                <p className="text-xs text-gray-600 mt-2">Cashier: {transaction.cashier.username}</p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed border-gray-300 my-4"></div>

                            {/* Items List */}
                            <div className="space-y-3">
                                {transaction.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-gray-600">
                                                {item.qty} × Rp {item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="font-semibold">
                                            Rp {(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed border-gray-300 my-4"></div>

                            {/* Subtotal, Discount, Tax, Total */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rp {transaction.subtotal.toLocaleString()}</span>
                                </div>
                                {transaction.discountTotal > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>- Rp {transaction.discountTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                {transaction.tax > 0 && (
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>Rp {transaction.tax.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-400 my-3"></div>

                            {/* Total */}
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>TOTAL</span>
                                <span>Rp {transaction.total.toLocaleString()}</span>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-6 text-xs text-gray-500">
                                <p>Thank you for your purchase!</p>
                                <p className="mt-1">Please keep this receipt for your records</p>
                            </div>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="border-t px-6 py-4 flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
                        >
                            Print Receipt
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Print-only Receipt Layout */}
            <div className="hidden print:block print-receipt">
                <div className="receipt-content">
                    {/* Receipt Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">POS System</h1>
                        <p className="text-sm text-gray-600 mt-1">Receipt #{transaction.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.createdAt)}</p>
                        <p className="text-xs text-gray-600 mt-2">Cashier: {transaction.cashier.username}</p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-300 my-4"></div>

                    {/* Items List */}
                    <div className="space-y-3">
                        {transaction.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-gray-600">
                                        {item.qty} × Rp {item.price.toLocaleString()}
                                    </p>
                                </div>
                                <div className="font-semibold">
                                    Rp {(item.price * item.qty).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-300 my-4"></div>

                    {/* Subtotal, Discount, Tax, Total */}
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rp {transaction.subtotal.toLocaleString()}</span>
                        </div>
                        {transaction.discountTotal > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>- Rp {transaction.discountTotal.toLocaleString()}</span>
                            </div>
                        )}
                        {transaction.tax > 0 && (
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>Rp {transaction.tax.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-400 my-3"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>TOTAL</span>
                        <span>Rp {transaction.total.toLocaleString()}</span>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 text-xs text-gray-500">
                        <p>Thank you for your purchase!</p>
                        <p className="mt-1">Please keep this receipt for your records</p>
                    </div>
                </div>
            </div>
        </>
    );
}
