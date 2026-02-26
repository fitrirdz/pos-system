import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/use-auth";

export default function CashierDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold">
                    Hi, {user?.username} 👋
                </h1>
                <p className="text-gray-500">
                    Ready to start selling?
                </p>
            </div>

            {/* Big Action Card */}
            <div className="bg-primary text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold">
                        Start New Transaction
                    </h2>
                    <p className="opacity-90 mt-2">
                        Create a new sale and process payment.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/transactions/new")}
                    className="bg-white text-primary font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-100 transition"
                >
                    + New Sale
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-sm text-gray-500">Today's Sales</p>
                    <h2 className="text-3xl font-bold mt-2">
                        Rp 2,450,000
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-sm text-gray-500">Transactions Today</p>
                    <h2 className="text-3xl font-bold mt-2">
                        18
                    </h2>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">
                    Recent Transactions
                </h2>

                <div className="text-sm text-gray-500">
                    No transactions yet.
                </div>
            </div>
        </div>
    );
}
