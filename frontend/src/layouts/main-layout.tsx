import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth.api';
import { useAuth } from '../context/use-auth';

export default function MainLayout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  const changeTheme = (theme: string) => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  };

  return (
    <div className='min-h-screen bg-appbg'>
      <header className='flex justify-between items-center p-4 bg-primary text-white'>
        <h1 className='font-bold text-lg'>POS System</h1>

        <div className='flex items-center gap-3'>
          <select
            onChange={(e) => changeTheme(e.target.value)}
            className='text-black px-2 py-1 rounded'
            defaultValue={localStorage.getItem('theme') || ''}
          >
            <option value=''>Blue</option>
            <option value='theme-green'>Green</option>
            <option value='theme-purple'>Purple</option>
          </select>

          <button
            onClick={handleLogout}
            className='bg-white text-primary px-3 py-1 rounded'
          >
            Logout
          </button>
        </div>
      </header>

      <main className='p-6'>
        <Outlet />
      </main>
    </div>
  );
}
