'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Image, UserCheck } from 'lucide-react';

const ModeratorFeatures: React.FC = () => {
  const moderatorFeatures = [
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
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-purple-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center mb-3">
          <UserCheck className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-green-900">Moderator Dashboard</h3>
        </div>
        <p className="text-green-700 text-sm">
          Selamat datang di panel moderator. Anda dapat mengelola produk dan portofolio sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moderatorFeatures.map((feature) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/management"
            className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Kelola Produk</span>
          </Link>
          <Link
            href="/dashboard/kelola-portofolio"
            className="flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Image className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Kelola Portofolio</span>
          </Link>
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Informasi Akses</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Role:</span>
            <span className="font-medium text-green-600">Moderator</span>
          </div>
          <div className="flex justify-between">
            <span>Akses Produk:</span>
            <span className="font-medium text-green-600">Full Access</span>
          </div>
          <div className="flex justify-between">
            <span>Akses Portofolio:</span>
            <span className="font-medium text-purple-600">Full Access</span>
          </div>
          <div className="flex justify-between">
            <span>Last Login:</span>
            <span className="font-medium">{new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorFeatures