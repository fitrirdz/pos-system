import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { useAuth } from '../context/use-auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser, loading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login({ username, password });
      setUser(data.user);
      navigate('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 px-6'>
      <div className='w-full max-w-sm'>
        {/* Coffee cup icon */}
        <div className='flex justify-center mb-8'>
          <div className='w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center'>
            <svg className='w-8 h-8 text-amber-900' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M11 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14z' />
            </svg>
          </div>
        </div>

        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-light text-amber-950 mb-2'>Brew</h1>
          <p className='text-amber-700 text-sm font-light'>Welcome back</p>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              className='w-full px-4 py-3 bg-white border border-amber-200 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            />
          </div>

          <div>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className='w-full px-4 py-3 bg-white border border-amber-200 rounded-lg text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            />
          </div>

          <button
            type='submit'
            disabled={isSubmitting || loading}
            className='w-full px-4 py-3 mt-6 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-light rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
