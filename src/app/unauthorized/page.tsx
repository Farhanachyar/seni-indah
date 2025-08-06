'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldX, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {

  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

  useEffect(() => {
      document.title = `Unauthorized | ${projectName}`;
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-4 py-8">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg text-center">
        {}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 blur-2xl opacity-20 rounded-full transform scale-110"></div>
          </div>
        </div>

        {}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8">
          {}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>

          {}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>

          {}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>

          {}
          <div className="space-y-4">
            {}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LayoutDashboard size={20} />
                Kembali ke Dashboard
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home size={20} />
                Kembali ke Beranda
              </Link>
            </div>

            {}
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft size={18} />
              Halaman Sebelumnya
            </button>
          </div>

          {}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Butuh bantuan? Hubungi administrator sistem untuk mendapatkan akses yang sesuai.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-50 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;