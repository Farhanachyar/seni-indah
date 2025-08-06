'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  Settings, 
  ArrowLeft,
  FileText,
  HelpCircle,
  Scroll,
  Image,
  ChevronRight,
  Info,
  AlertTriangle,
  Globe
} from 'lucide-react';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

const SettingsPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    document.title = `Pengaturan | ${projectName}`;
  }, []);

  const menuItems = [
    {
      title: 'Konfigurasi Dasar',
      description: 'Kelola informasi dasar sistem seperti slogan, kontak, dan lokasi toko',
      icon: FileText,
      path: '/dashboard/pengaturan/konfigurasi-dasar',
      color: 'bg-blue-100 text-blue-600',
      items: ['Slogan', 'WhatsApp', 'Lokasi Toko', 'Informasi Kategori']
    },
    {
      title: 'Sliding Teks',
      description: 'Kelola teks bergerak yang ditampilkan di halaman utama',
      icon: Scroll,
      path: '/dashboard/pengaturan/sliding-teks',
      color: 'bg-indigo-100 text-indigo-600',
      items: ['Tambah Teks', 'Edit Teks', 'Hapus Teks']
    },
    {
      title: 'FAQ',
      description: 'Kelola pertanyaan yang sering diajukan dan jawabannya',
      icon: HelpCircle,
      path: '/dashboard/pengaturan/faq',
      color: 'bg-purple-100 text-purple-600',
      items: ['Tambah FAQ', 'Edit FAQ', 'Hapus FAQ']
    },
    {
      title: 'Logo Website',
      description: 'Kelola logo dan media visual lainnya',
      icon: Image,
      path: '/dashboard/pengaturan/logo',
      color: 'bg-red-100 text-red-600',
      items: ['Upload Logo', 'Ganti Logo', 'Hapus Logo'],
      critical: true
    },
    {
      title: 'Icon Website',
      description: 'Kelola favicon dan icon yang tampil di browser',
      icon: Globe,
      path: '/dashboard/pengaturan/icon',
      color: 'bg-red-100 text-red-600',
      items: ['Upload Icon', 'Ganti Icon', 'Hapus Icon'],
      critical: true
    }
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {}
          <div className="mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>

          {}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Pengaturan Critical Website</h3>
                <p className="text-sm text-yellow-700">Perubahan pada pengaturan ini akan mempengaruhi tampilan dan fungsi website secara keseluruhan. Harap berhati-hati saat melakukan perubahan.</p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
                <p className="text-gray-600">Kelola konfigurasi sistem dan konten dinamis dengan mudah</p>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${item.critical ? 'border-2 border-red-200' : ''}`}
                  onClick={() => router.push(item.path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center relative`}>
                        <IconComponent className="w-6 h-6" />
                        {item.critical && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <span>{item.title}</span>
                          {item.critical && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">CRITICAL</span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {item.items.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;