'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Package, Image, Settings, BarChart3, UserCog } from 'lucide-react';

const AdminFeatures: React.FC = () => {
  const adminFeatures = [
    {
      title: 'Kelola User',
      description: 'Mengelola akun pengguna, tambah user baru, ubah password, dan hapus akun',
      icon: Users,
      href: '/dashboard/kelola-user',
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    {
      title: 'Kelola Produk',
      description: 'Mengelola daftar produk, tambah produk baru, edit, dan hapus produk',
      icon: Package,
      href: '/dashboard/management',
      color: 'bg-green-100 text-green-600',
      hoverColor: 'hover:bg-green-50'
    },
    {
      title: 'Kelola Portofolio',
      description: 'Mengelola postingan portofolio, galeri, dan konten website',
      icon: Image,
      href: '/dashboard/kelola-portofolio',
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:bg-purple-50'
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi sistem, Sliding Text, FAQ, Informasi Kategori dan Pergantian Logo',
      icon: Settings,
      href: '/dashboard/pengaturan',
      color: 'bg-gray-100 text-gray-600',
      hoverColor: 'hover:bg-gray-50'
    },
    {
      title: 'Analytics',
      description: 'Dashboard analitik, grafik performa, dan metrics sistem',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'bg-orange-100 text-orange-600',
      hoverColor: 'hover:bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center mb-3">
          <UserCog className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">Admin Dashboard</h3>
        </div>
        <p className="text-blue-700 text-sm">
          Selamat datang di panel admin. Anda memiliki akses untuk mengelola pengguna, konten, dan sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminFeatures.map((feature) => {
          const IconComponent = feature.icon;

          return (
            <Link
              key={feature.title}
              href={feature.href}
              className={`block bg-white rounded-lg border border-gray-200 p-6 ${feature.hoverColor} transition-colors duration-200 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/kelola-user"
            className="flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Kelola User</span>
          </Link>
          <Link
            href="/dashboard/management"
            className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Kelola Produk</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center justify-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Analytics</span>
          </Link>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Sistem</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Role:</span>
            <span className="font-medium text-blue-600">Administrator</span>
          </div>
          <div className="flex justify-between">
            <span>User Management:</span>
            <span className="font-medium text-blue-600">Full Access</span>
          </div>
          <div className="flex justify-between">
            <span>Content Management:</span>
            <span className="font-medium text-green-600">Full Access</span>
          </div>
          <div className="flex justify-between">
            <span>System Settings:</span>
            <span className="font-medium text-gray-600">Limited Access</span>
          </div>
          <div className="flex justify-between">
            <span>Last Activity:</span>
            <span className="font-medium">{new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeatures;