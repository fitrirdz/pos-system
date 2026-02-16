import { useState } from 'react';
import api from '../api/axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-sm bg-white p-6 rounded-xl shadow'
      >
        <h1 className='text-2xl font-bold text-center mb-6'>
          POS System Login
        </h1>

        {error && (
          <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>
        )}

        <input
          className='w-full mb-3 p-2 border rounded'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className='w-full mb-4 p-2 border rounded'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
        >
          Login
        </button>
      </form>
    </div>
  );
}
