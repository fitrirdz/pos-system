import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/use-auth";
import { ADMIN_MENU, CASHIER_MENU } from '../constants/global';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const menu = user?.role === "ADMIN" ? ADMIN_MENU : CASHIER_MENU;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 hidden md:flex md:flex-col">
        <div>
          <h2 className="text-xl font-bold mb-8">MyPOS</h2>

          <nav className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${isActive
                    ? "bg-white text-blue-700 font-semibold"
                    : "hover:bg-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Info */}
        <div className="mt-6 border-t border-blue-500 pt-4">
          <p className="text-sm opacity-80">{user?.username}</p>
          <p className="text-xs opacity-60 mb-3">{user?.role}</p>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar (mobile fallback) */}
        <header className="md:hidden bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
          <h1 className="font-semibold">MyPOS</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </header>

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
