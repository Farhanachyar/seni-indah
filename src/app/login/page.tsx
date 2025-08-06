'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, User, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../components/AuthProvider';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuthContext();

  useEffect(() => {
      document.title = `Login | ${projectName}`;
    }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {

        router.push('/dashboard');
      } else {

        let userFriendlyMessage = 'Login gagal. Silakan coba lagi.';

        if (result.message) {
          const message = result.message.toLowerCase();

          if (message.includes('email') || message.includes('password') || 
              message.includes('username') || message.includes('salah') ||
              message.includes('wrong') || message.includes('invalid') ||
              message.includes('unauthorized')) {
            userFriendlyMessage = 'Email atau password salah.';
          } else if (message.includes('network') || message.includes('connection')) {
            userFriendlyMessage = 'Koneksi bermasalah. Coba lagi.';
          } else if (message.includes('timeout')) {
            userFriendlyMessage = 'Koneksi timeout. Coba lagi.';
          }

        }

        setError(userFriendlyMessage);
      }

    } catch (err: any) {
      console.error('Login error:', err);

      let userMessage = 'Terjadi kesalahan. Coba lagi.';

      if (err.message) {
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          userMessage = 'Koneksi bermasalah. Coba lagi.';
        }
      }

      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorStyling = () => {
    return {
      containerClass: 'bg-red-50 border-red-200',
      textClass: 'text-red-600',
      iconColor: 'text-red-500'
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const errorStyling = getErrorStyling();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden flex items-center justify-center px-4 py-8">
      {}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-secondary rounded-full"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-secondary-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-secondary-300 rounded-full"></div>
        <div className="absolute top-80 right-60 w-12 h-12 bg-primary rounded-full animate-pulse"></div>

        {}
        <div className="absolute top-40 left-60 w-16 h-16 bg-secondary transform rotate-45"></div>
        <div className="absolute bottom-60 right-40 w-20 h-20 bg-primary-500 transform rotate-12"></div>
        <div className="absolute top-96 left-20 w-8 h-24 bg-secondary-400 transform -rotate-45"></div>
      </div>

      {}
      <div className="absolute inset-0 opacity-8">
        <div className="grid grid-cols-20 gap-6 h-full w-full">
          {Array.from({length: 100}).map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-secondary-300'}`}></div>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Kembali ke Beranda</span>
        </Link>

        {}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
            <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {}
          {error && (
            <div className={`mb-6 p-4 border rounded-lg ${errorStyling.containerClass}`}>
              <div className="flex items-center space-x-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${errorStyling.iconColor}`} />
                <p className={`text-sm font-medium ${errorStyling.textClass}`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {}
          <form onSubmit={handleSubmit} className="space-y-6">
            {}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white/50`}
                  placeholder="nama@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 bg-white/50`}
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Lupa password atau butuh bantuan?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Hubungi administrator sistem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;