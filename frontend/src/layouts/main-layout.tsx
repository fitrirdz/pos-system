import { useState } from 'react';
import axios from 'axios';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { changeMyPassword } from '../api/auth.api';
import { useAuth } from '../context/use-auth';
import { useToast } from '../context/use-toast';
import { ADMIN_MENU, CASHIER_MENU } from '../constants/global';
import ChangePasswordModal from '../components/change-password-modal';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleChangePassword = async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setIsUpdatingPassword(true);

    try {
      await changeMyPassword(payload);
      showToast('Password updated successfully', 'success');
      setIsChangePasswordOpen(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;

      showToast(
        message || 'Failed to update password',
        'error',
      );
      throw error;
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const menu = user?.role === 'ADMIN' ? ADMIN_MENU : CASHIER_MENU;

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-64 bg-primary text-white p-6 hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0'>
        <div>
          {/* align center and placed on the left */}
          <div className='flex items-center justify-start space-x-3 mb-6'>
            <img
              src='/cashier.svg'
              alt='MyPOS Logo'
              className='w-10 h-10'
            />
            <h2 className='text-xl font-bold'>MyPOS</h2>
          </div>

          <nav className='space-y-2'>
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-white text-primary font-semibold'
                      : 'hover:bg-primary-hover'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Spacer */}
        <div className='flex-1' />

        {/* User Info */}
        <div className='mt-6 border-t border-primary-hover pt-4'>
          <p className='text-sm opacity-80'>{user?.username}</p>
          <p className='text-xs opacity-60 mb-3'>{user?.role}</p>

          <details className='mb-3'>
            <summary className='cursor-pointer text-sm font-semibold py-2 px-3 rounded-lg bg-primary-hover/70 hover:bg-primary-hover'>
              Preferences
            </summary>
            <div className='mt-2'>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className='w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-primary-hover/70 transition'
              >
                Change Password
              </button>
            </div>
          </details>

          <button
            onClick={handleLogout}
            className='w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition'
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col md:ml-64'>
        {/* Topbar (mobile fallback) */}
        <header className='md:hidden bg-primary text-white px-4 py-3 flex justify-between items-center'>
          <h1 className='font-semibold'>MyPOS</h1>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className='bg-primary-hover px-3 py-1 rounded text-sm'
            >
              Preferences
            </button>
            <button
              onClick={handleLogout}
              className='bg-red-600 px-3 py-1 rounded text-sm'
            >
              Logout
            </button>
          </div>
        </header>

        <main className='p-6 flex-1'>
          <Outlet />
        </main>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        isLoading={isUpdatingPassword}
        onCancel={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
