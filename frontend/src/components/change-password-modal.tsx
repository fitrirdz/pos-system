import { useState } from 'react';

type ChangePasswordModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (payload: { currentPassword: string; newPassword: string }) => Promise<void>;
};

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
      </svg>
    );
  }

  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
    </svg>
  );
}

export default function ChangePasswordModal({
  isOpen,
  isLoading,
  onCancel,
  onSubmit,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setError('');

    try {
      await onSubmit({ currentPassword, newPassword });
      resetForm();
    } catch {
      // Error feedback is handled by toast in parent.
    }
  };

  return (
    <div className='fixed -inset-4 bg-black/40 z-[70] flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4'>
        <h2 className='text-xl font-bold text-gray-900'>Change Password</h2>

        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Current Password
            </label>
            <div className='relative'>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className='w-full px-4 py-2 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                disabled={isLoading}
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                <PasswordVisibilityIcon visible={showCurrentPassword} />
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              New Password
            </label>
            <div className='relative'>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full px-4 py-2 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() => setShowNewPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                disabled={isLoading}
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                <PasswordVisibilityIcon visible={showNewPassword} />
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm New Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-4 py-2 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
                disabled={isLoading}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <PasswordVisibilityIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          {error ? (
            <div className='text-sm text-red-600 bg-red-50 p-3 rounded-lg'>{error}</div>
          ) : null}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
