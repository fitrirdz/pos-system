import type { User } from '../interfaces';
import type { UserRole } from '../api/user.api';

type UserFormModalProps = {
  isOpen: boolean;
  editingUser: User | null;
  form: {
    username: string;
    password: string;
    role: UserRole;
  };
  isLoading: boolean;
  onFormChange: (field: 'username' | 'password' | 'role', value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function UserFormModal({
  isOpen,
  editingUser,
  form,
  isLoading,
  onFormChange,
  onSave,
  onCancel,
}: UserFormModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed -inset-4 bg-black/40 z-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-lg bg-white rounded-xl shadow-xl p-6 space-y-4'>
        <h2 className='text-xl font-bold text-gray-900'>
          {editingUser ? 'Edit User' : 'Add User'}
        </h2>

        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <input
              type='text'
              value={form.username}
              onChange={(e) => onFormChange('username', e.target.value)}
              placeholder='Enter username'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password {editingUser ? '(Optional)' : ''}
            </label>
            <input
              type='password'
              value={form.password}
              onChange={(e) => onFormChange('password', e.target.value)}
              placeholder={
                editingUser ? 'Leave empty to keep current password' : 'Enter password'
              }
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              disabled={isLoading}
            />
          </div>

          {!editingUser ? (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => onFormChange('role', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                disabled={isLoading}
              >
                <option value='CASHIER'>CASHIER</option>
                <option value='ADMIN'>ADMIN</option>
              </select>
            </div>
          ) : null}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isLoading}
            className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {isLoading
              ? 'Saving...'
              : editingUser
                ? 'Save Changes'
                : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
