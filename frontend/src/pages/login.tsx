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
    <div className='min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* LEFT SIDE - BRANDING */}
      <div className='hidden lg:flex lg:w-1/2 items-center justify-center px-12'>
        <div className='max-w-md space-y-8'>
          <div className='space-y-2'>
            <div className='inline-block p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl'>
              <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 3H5a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2zm0 0V3m0 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V5zm0 14H5a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2zm10-4h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2z' />
              </svg>
            </div>
            <h1 className='text-5xl font-bold text-white'>POS System</h1>
          </div>
          <p className='text-lg text-slate-400 leading-relaxed'>
            Modern Point of Sale platform designed for seamless transactions and inventory management.
          </p>
          <div className='pt-8 space-y-4'>
            <div className='flex gap-4 items-start'>
              <div className='flex-shrink-0'>
                <div className='flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20'>
                  <svg className='w-5 h-5 text-emerald-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
              </div>
              <div>
                <p className='font-semibold text-white'>Fast & Reliable</p>
                <p className='text-sm text-slate-400'>Lightning-quick transaction processing</p>
              </div>
            </div>
            <div className='flex gap-4 items-start'>
              <div className='flex-shrink-0'>
                <div className='flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20'>
                  <svg className='w-5 h-5 text-emerald-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
              </div>
              <div>
                <p className='font-semibold text-white'>Secure & Encrypted</p>
                <p className='text-sm text-slate-400'>Enterprise-grade security standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className='flex w-full lg:w-1/2 items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md'>
          <div className='space-y-2 mb-10'>
            <h2 className='text-3xl font-bold text-white'>Welcome Back</h2>
            <p className='text-slate-400'>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg'>
              <div className='flex gap-3'>
                <svg className='w-5 h-5 text-red-400 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                </svg>
                <p className='text-sm text-red-400'>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-slate-300'>
                Username
              </label>
              <input
                type='text'
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                className='w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-slate-300'>
                Password
              </label>
              <input
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className='w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting || loading}
              className='w-full px-4 py-3 mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <svg className='w-4 h-4 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 2v4m6.364 1.636l-2.828 2.828m2 7.072h4m-1.636 6.364l-2.828-2.828m-7.072 2l2.828-2.828m-2-7.072H4m1.636-6.364l2.828 2.828' />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className='text-center text-xs text-slate-500 mt-8'>
            © {new Date().getFullYear()} POS System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
