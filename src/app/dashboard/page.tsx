'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../components/AuthProvider';
import ProtectedRoute from '../../components/ProtectedRoute';
import { LogOut, User, Shield, Lock, Eye, EyeOff, Check, X } from 'lucide-react';

import SuperAdminFeatures from '../../components/roles/SuperAdminFeatures';
import AdminFeatures from '../../components/roles/AdminFeatures';
import ModeratorFeatures from '../../components/roles/ModeratorFeatures';
import UserFeatures from '../../components/roles/UserFeatures';

import { apiPost, ApiError } from '../../utils/apiClient';

interface ApiResponse {
  success: boolean;
  data: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthContext();

  useEffect(() => {
    if (user?.email) {
      document.title = `Dashboard | ${user.email}`;
    } 
  }, [user?.email]);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const formatRole = (role: string) => {
    return role?.replace(/_/g, ' ').toUpperCase();
  };

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

  const passwordValidation = validatePassword(passwordData.newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordLoading(true);
    setChangePasswordMessage('');
    setChangePasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setChangePasswordError('Semua field harus diisi');
      setChangePasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setChangePasswordError('Password baru dan konfirmasi password tidak cocok');
      setChangePasswordLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setChangePasswordError('Password baru tidak memenuhi kriteria keamanan');
      setChangePasswordLoading(false);
      return;
    }

    try {

      const result = await apiPost<ApiResponse>(
        '/v1.0/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      );

      if (result.success) {
        setChangePasswordMessage('Password berhasil diubah');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          setShowChangePassword(false);
          setChangePasswordMessage('');
        }, 3000);
      } else {
        setChangePasswordError(result.data || 'Gagal mengubah password');
      }
    } catch (err) {
      console.error('Change password error:', err);
      if (err instanceof ApiError) {
        setChangePasswordError(err.message);
      } else {
        setChangePasswordError(err instanceof Error ? err.message : 'Terjadi kesalahan koneksi');
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderRoleFeatures = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminFeatures />;
      case 'admin':
        return <AdminFeatures />;
      case 'moderator':
        return <ModeratorFeatures />;
      case 'user':
        return <UserFeatures />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Role tidak dikenali atau tidak ada akses.</p>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Selamat datang, {user?.name}!</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Informasi Akun</h2>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Ubah Password</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user?.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'admin' ? 'bg-orange-100 text-orange-800' :
                    user?.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {formatRole(user?.role || '')}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                <p className="text-gray-900">#{user?.id}</p>
              </div>
            </div>

            {}
            {showChangePassword && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Ubah Password</h3>

                {changePasswordMessage && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {changePasswordMessage}
                  </div>
                )}

                {changePasswordError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {changePasswordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Masukkan password saat ini"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Masukkan password baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {}
                    {passwordData.newPassword && (
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

                  {}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Konfirmasi password baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">Password tidak cocok</p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={changePasswordLoading || !passwordValidation.isValid || passwordData.newPassword !== passwordData.confirmPassword}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changePasswordLoading ? 'Mengubah...' : 'Ubah Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setChangePasswordMessage('');
                        setChangePasswordError('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fitur yang Tersedia</h2>
            {renderRoleFeatures()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;