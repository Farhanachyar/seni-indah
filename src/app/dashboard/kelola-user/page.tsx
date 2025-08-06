'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../components/AuthProvider';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Key, 
  Eye, 
  EyeOff, 
  Shield,
  ArrowLeft,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

import { apiPost, ApiError } from '../../../utils/apiClient';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: number;
  registered: string;
  last_login?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

const KelolaUserPage: React.FC = () => {
  const { user: currentUser } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [userFormData, setUserFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordValidation = validatePassword(userFormData.password);
  const newPasswordValidation = validatePassword(newPassword);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const result = await apiPost<ApiResponse<User[]>>(
        '/v1.0/admin/users',
        {}
      );

      if (result.success) {
        setUsers(result.data);
      } else {
        setError('Gagal memuat data user');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat memuat data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');
    setError('');

    if (!passwordValidation.isValid) {
      setError('Password tidak memenuhi kriteria keamanan');
      setFormLoading(false);
      return;
    }

    try {

      const result = await apiPost<ApiResponse>(
        '/v1.0/admin/user/create',
        userFormData
      );

      if (result.success) {
        setMessage('User berhasil ditambahkan');
        setUserFormData({ username: '', email: '', password: '', role: 'user' });
        setShowAddForm(false);
        await fetchUsers();
      } else {
        setError(result.data || 'Gagal menambahkan user');
      }
    } catch (error) {
      console.error('Add user error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menambahkan user');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    setChangePasswordLoading(true);
    setMessage('');
    setError('');

    if (!newPasswordValidation.isValid) {
      setError('Password tidak memenuhi kriteria keamanan');
      setChangePasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setChangePasswordLoading(false);
      return;
    }

    try {

      const result = await apiPost<ApiResponse>(
        '/v1.0/admin/user/change-password',
        {
          userId: selectedUser.id,
          newPassword: newPassword
        }
      );

      if (result.success) {
        setMessage(`Password user ${selectedUser.username} berhasil diubah`);
        setShowChangePasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setSelectedUser(null);
      } else {
        setError(result.data || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat mengubah password');
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {

      const result = await apiPost<ApiResponse>(
        '/v1.0/admin/user/delete',
        { id: selectedUser.id }
      );

      if (result.success) {
        setMessage(`User ${selectedUser.username} berhasil dihapus`);
        setShowDeleteModal(false);
        setSelectedUser(null);
        await fetchUsers();
      } else {
        setError(result.data || 'Gagal menghapus user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menghapus user');
      }
    }
  };

  const formatRole = (role: string) => {
    return role?.replace(/_/g, ' ').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    if (currentUser?.email) {
      document.title = `Kelola User | ${currentUser.email}`;
    } 
  }, [currentUser?.email]);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
                    <p className="text-gray-600">Kelola akun pengguna sistem</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah User</span>
              </button>
            </div>
          </div>

          {}
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan username, email, atau role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredUsers.length} dari {users.length} user
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Memuat data user...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Terdaftar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Login Terakhir
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-blue-600 mr-2" />
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'admin' ? 'bg-orange-100 text-orange-800' :
                              user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {formatRole(user.role)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.registered)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.last_login || '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {user.id !== currentUser?.id && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowChangePasswordModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                  title="Ubah Password"
                                >
                                  <Key className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded"
                                  title="Hapus User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {user.id === currentUser?.id && (
                              <span className="text-gray-400 text-xs">Akun Anda</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>Tidak ada user yang ditemukan</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah User Baru</h3>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userFormData.username}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userFormData.password}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Masukkan password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {userFormData.password && (
                    <div className="mt-2 space-y-1">
                      <div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.minLength ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Minimal 8 karakter
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.hasUpper ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Mengandung huruf besar
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.hasLower ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Mengandung huruf kecil
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.hasNumber ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Mengandung angka
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    {currentUser?.role === 'super_admin' && (
                      <option value="super_admin">Super Admin</option>
                    )}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading || !passwordValidation.isValid}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Menambahkan...' : 'Tambah User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setUserFormData({ username: '', email: '', password: '', role: 'user' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {}
        {showChangePasswordModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ubah Password - {selectedUser.username}
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan password baru"
                    required
                  />

                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className={`flex items-center text-xs ${newPasswordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                        {newPasswordValidation.minLength ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Minimal 8 karakter
                      </div>
                      <div className={`flex items-center text-xs ${newPasswordValidation.hasUpper ? 'text-green-600' : 'text-red-600'}`}>
                        {newPasswordValidation.hasUpper ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Mengandung huruf besar
                      </div>
                      <div className={`flex items-center text-xs ${newPasswordValidation.hasLower ? 'text-green-600' : 'text-red-600'}`}>
                        {newPasswordValidation.hasLower ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Mengandung huruf kecil
                      </div>
                      <div className={`flex items-center text-xs ${newPasswordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        {newPasswordValidation.hasNumber ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Mengandung angka
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Konfirmasi password baru"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      Password tidak cocok
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={changePasswordLoading || !newPasswordValidation.isValid || newPassword !== confirmPassword}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changePasswordLoading ? 'Mengubah...' : 'Ubah Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setNewPassword('');
                      setConfirmPassword('');
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus User</h3>
              </div>

              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus user <strong>{selectedUser.username}</strong>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default KelolaUserPage;