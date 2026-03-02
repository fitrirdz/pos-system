import type { CartItem } from '../interfaces';

interface CartProps {
    cart: CartItem[];
    onCheckout: () => void;
    onUpdateQuantity: (code: string, newQty: number) => void;
    onRemove: (code: string) => void;
}

export default function Cart({ cart, onCheckout, onUpdateQuantity, onRemove }: CartProps) {
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
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
                        className="flex flex-col border-b pb-3 gap-2"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Rp {item.price.toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => onRemove(item.code)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                title="Remove item"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onUpdateQuantity(item.code, item.qty - 1)}
                                    className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                                    title="Decrease quantity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value)) {
                                            onUpdateQuantity(item.code, value);
                                        }
                                    }}
                                    className="w-14 text-center border border-gray-300 rounded px-2 py-1"
                                    min="1"
                                />
                                <button
                                    onClick={() => onUpdateQuantity(item.code, item.qty + 1)}
                                    className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                                    title="Increase quantity"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <span className="font-medium">
                                Rp {(item.price * item.qty).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString()}</span>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                    className="mt-4 w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition"
                >
                    Process Payment
                </button>
            </div>
        </div>
    );
}
