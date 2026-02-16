import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/use-auth';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-64 bg-blue-700 text-white p-6 hidden md:block'>
        <h2 className='text-xl font-bold mb-8'>MyPOS</h2>

        <nav className='space-y-4'>
          <div className='hover:text-blue-200 cursor-pointer'>Dashboard</div>
          <div className='hover:text-blue-200 cursor-pointer'>Transactions</div>
          <div className='hover:text-blue-200 cursor-pointer'>Products</div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Topbar */}
        <header className='bg-white shadow px-6 py-4 flex justify-between items-center'>
          <div>
            <h1 className='font-semibold text-lg'>Welcome, {user?.username}</h1>
          </div>

          <button
            onClick={handleLogout}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition'
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className='p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
