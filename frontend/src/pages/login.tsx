import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { useAuth } from '../context/use-auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser, loading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login({ username, password });
      setUser(data.user);
      navigate('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className='min-h-screen flex'>
      {/* LEFT SIDE */}
      <div className='hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center'>
        <div className='max-w-md text-center space-y-6 px-6'>
          <h1 className='text-4xl font-bold'>POS System</h1>
          <p className='text-blue-100'>
            Modern & Simple Point of Sale Application
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className='flex w-full md:w-1/2 items-center justify-center bg-gray-50'>
        <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-xl'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Sign In</h2>

          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-10'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                )}
              </button>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition'
            >
              Login
            </button>
          </form>

          <p className='text-center text-xs text-gray-400 mt-6'>
            © {new Date().getFullYear()} POS System
          </p>
        </div>
      </div>
    </div>
  );
}
