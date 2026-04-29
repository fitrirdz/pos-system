import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createUser,
  deactivateUser,
  type UserRole,
  updateUser,
  updateUserRole,
} from '../../api/user.api';
import DeleteConfirmationModal from '../../components/delete-confirmation-modal';
import { useToast } from '../../context/use-toast';
import { USERS_QUERY_KEY, useUsers } from '../../hooks/use-users';
import type { User } from '../../interfaces';

type FormState = {
  username: string;
  password: string;
  role: UserRole;
};

const defaultFormState: FormState = {
  username: '',
  password: '',
  role: 'CASHIER',
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: users = [], isLoading: isLoadingUsers, isFetching } = useUsers();

  const [searchInput, setSearchInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingDeactivateUser, setPendingDeactivateUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(defaultFormState);

  const visibleUsers = useMemo(() => {
    const keyword = searchInput.trim().toLowerCase();
    if (!keyword) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.username.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword)
      );
    });
  }, [searchInput, users]);

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
  };

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      invalidateUsers();
      showToast('User created successfully', 'success');
      closeModal();
    },
    onError: () => {
      showToast('Failed to create user', 'error');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { username?: string; password?: string } }) =>
      updateUser(id, payload),
    onSuccess: () => {
      invalidateUsers();
      showToast('User updated successfully', 'success');
      closeModal();
    },
    onError: () => {
      showToast('Failed to update user', 'error');
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      invalidateUsers();
      showToast('User deactivated successfully', 'success');
      setPendingDeactivateUser(null);
    },
    onError: () => {
      showToast('Failed to deactivate user', 'error');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      updateUserRole(id, { role }),
    onSuccess: () => {
      invalidateUsers();
      showToast('User role updated successfully', 'success');
    },
    onError: () => {
      showToast('Failed to update user role', 'error');
    },
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(defaultFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: '',
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setForm(defaultFormState);
    setIsModalOpen(false);
  };

  const handleSaveUser = () => {
    const username = form.username.trim();
    const password = form.password.trim();

    if (!username) {
      showToast('Username is required', 'error');
      return;
    }

    if (!editingUser && !password) {
      showToast('Password is required for new user', 'error');
      return;
    }

    if (editingUser) {
      const payload: { username?: string; password?: string } = {};

      if (username !== editingUser.username) {
        payload.username = username;
      }

      if (password) {
        payload.password = password;
      }

      if (!payload.username && !payload.password) {
        showToast('No changes detected', 'error');
        return;
      }

      updateUserMutation.mutate({ id: editingUser.id, payload });
      return;
    }

    createUserMutation.mutate({
      username,
      password,
      role: form.role,
    });
  };

  const handleToggleRole = (user: User) => {
    const nextRole: UserRole = user.role === 'ADMIN' ? 'CASHIER' : 'ADMIN';
    updateRoleMutation.mutate({ id: user.id, role: nextRole });
  };

  const confirmDeactivate = () => {
    if (!pendingDeactivateUser) {
      return;
    }
    deactivateUserMutation.mutate(pendingDeactivateUser.id);
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white p-6 rounded-xl shadow'>
        <h1 className='text-2xl font-bold'>👥 Users</h1>
        <p className='text-gray-500 mt-2'>Manage user accounts, roles, and active status.</p>
      </div>

      <div className='bg-white p-6 rounded-xl shadow space-y-4'>
        <div className='flex flex-col md:flex-row gap-3 md:items-end md:justify-between'>
          <div className='w-full md:max-w-md'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Search User
            </label>
            <input
              type='text'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Search by username or role'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <button
            onClick={openCreateModal}
            className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition'
          >
            + Add User
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px]'>
            <thead className='border-b'>
              <tr className='text-left text-sm text-gray-600'>
                <th className='py-3 font-semibold w-16'>No</th>
                <th className='py-3 font-semibold'>Username</th>
                <th className='py-3 font-semibold'>Role</th>
                <th className='py-3 font-semibold'>Status</th>
                <th className='py-3 font-semibold w-[320px]'>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={5} className='py-8 text-center text-gray-500'>
                    Loading users...
                  </td>
                </tr>
              ) : visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-8 text-center text-gray-500'>
                    No users found
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user, index) => {
                  const isActive = user.isActive !== false;

                  return (
                    <tr key={user.id} className='border-b last:border-0'>
                      <td className='py-3 text-sm text-gray-700'>{index + 1}</td>
                      <td className='py-3 text-sm font-medium text-gray-900'>{user.username}</td>
                      <td className='py-3 text-sm text-gray-900'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className='py-3 text-sm'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className='py-3'>
                        <div className='flex flex-wrap gap-2'>
                          <button
                            onClick={() => openEditModal(user)}
                            disabled={!isActive}
                            className='px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleRole(user)}
                            disabled={!isActive || updateRoleMutation.isPending}
                            className='px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed'
                          >
                            {user.role === 'ADMIN' ? 'Set Cashier' : 'Set Admin'}
                          </button>
                          <button
                            onClick={() => setPendingDeactivateUser(user)}
                            disabled={!isActive || deactivateUserMutation.isPending}
                            className='px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed'
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className='text-sm text-gray-500'>
          Showing {visibleUsers.length} of {users.length} users
          {isFetching ? ' (updating...)' : ''}
        </p>
      </div>

      {isModalOpen ? (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4'>
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder='Enter username'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Password {editingUser ? '(Optional)' : ''}
                </label>
                <input
                  type='password'
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder={
                    editingUser ? 'Leave empty to keep current password' : 'Enter password'
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              {!editingUser ? (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, role: e.target.value as UserRole }))
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                  >
                    <option value='CASHIER'>CASHIER</option>
                    <option value='ADMIN'>ADMIN</option>
                  </select>
                </div>
              ) : null}
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                onClick={closeModal}
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
                className='px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {createUserMutation.isPending || updateUserMutation.isPending
                  ? 'Saving...'
                  : editingUser
                    ? 'Save Changes'
                    : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <DeleteConfirmationModal
        isOpen={Boolean(pendingDeactivateUser)}
        title='Deactivate User'
        description='Are you sure you want to deactivate this user account? They will not be able to login.'
        itemName={pendingDeactivateUser?.username || '-'}
        itemCode={pendingDeactivateUser?.role}
        confirmLabel='Deactivate'
        isLoading={deactivateUserMutation.isPending}
        onCancel={() => {
          if (!deactivateUserMutation.isPending) {
            setPendingDeactivateUser(null);
          }
        }}
        onConfirm={confirmDeactivate}
      />
    </div>
  );
}
