import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { useAuth } from '../context/use-auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

            <input
              type='password'
              className='w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
