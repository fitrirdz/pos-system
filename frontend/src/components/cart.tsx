import type { CartItem } from '../interfaces';

interface CartProps {
    cart: CartItem[];
    onCheckout: () => void;
}

export default function Cart({ cart, onCheckout }: CartProps) {
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
