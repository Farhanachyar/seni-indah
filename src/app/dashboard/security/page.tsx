'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../components/AuthProvider';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  Shield, 
  Activity, 
  Eye, 
  Lock, 
  AlertTriangle, 
  Users, 
  FileText, 
  Settings,
  ChevronRight,
  Clock,
  Monitor,
  Key,
  Database,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const SecurityPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      document.title = `Security | ${user.email}`;
    } 
  }, [user?.email]);

  const getSecurityFeatures = () => {
    const baseFeatures = [
      {
        id: 'logs',
        title: 'Log Aktivitas',
        description: 'Lihat semua aktivitas sistem dan pengguna',
        icon: FileText,
        color: 'blue',
        path: '/dashboard/security/logs',
        available: true
      }
    ];

    const adminFeatures = [
      {
        id: 'user-sessions',
        title: 'Sesi Pengguna',
        description: 'Monitor sesi aktif pengguna',
        icon: Users,
        color: 'green',
        path: '/dashboard/security/sessions',
        available: false
      },
      {
        id: 'security-alerts',
        title: 'Peringatan Keamanan',
        description: 'Kelola peringatan dan ancaman keamanan',
        icon: AlertTriangle,
        color: 'yellow',
        path: '/dashboard/security/alerts',
        available: false
      },
      {
        id: 'access-control',
        title: 'Kontrol Akses',
        description: 'Atur izin dan hak akses pengguna',
        icon: Lock,
        color: 'purple',
        path: '/dashboard/security/access-control',
        available: false
      }
    ];

    const superAdminFeatures = [
      {
        id: 'system-monitor',
        title: 'Monitor Sistem',
        description: 'Pantau performa dan keamanan sistem',
        icon: Monitor,
        color: 'red',
        path: '/dashboard/security/system-monitor',
        available: false
      },
      {
        id: 'api-keys',
        title: 'API Keys',
        description: 'Kelola kunci API dan autentikasi',
        icon: Key,
        color: 'indigo',
        path: '/dashboard/security/api-keys',
        available: false
      },
      {
        id: 'backup-security',
        title: 'Keamanan Backup',
        description: 'Atur keamanan backup dan recovery',
        icon: Database,
        color: 'gray',
        path: '/dashboard/security/backup',
        available: false
      }
    ];

    if (user?.role === 'super_admin') {
      return [...baseFeatures, ...adminFeatures, ...superAdminFeatures];
    } else if (user?.role === 'admin') {
      return [...baseFeatures, ...adminFeatures];
    } else {
      return baseFeatures;
    }
  };

  const handleFeatureClick = (feature: any) => {
    if (feature.available) {
      router.push(feature.path);
    }
  };

  const getColorClasses = (color: string, available: boolean) => {
    if (!available) {
      return {
        bg: 'bg-gray-100',
        icon: 'text-gray-400',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-50'
      };
    }

    const colorMap: { [key: string]: any } = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:bg-green-100'
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        border: 'border-yellow-200',
        hover: 'hover:bg-yellow-100'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        border: 'border-red-200',
        hover: 'hover:bg-red-100'
      },
      indigo: {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-600',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-100'
      },
      gray: {
        bg: 'bg-gray-50',
        icon: 'text-gray-600',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-100'
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Keamanan Sistem</h1>
                <p className="text-gray-600">Kelola dan monitor keamanan aplikasi</p>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Fitur Keamanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSecurityFeatures().map((feature) => {
                const colorClasses = getColorClasses(feature.color, feature.available);
                const IconComponent = feature.icon;

                return (
                  <div
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature)}
                    className={`
                      relative border-2 rounded-lg p-6 transition-all duration-200 
                      ${colorClasses.bg} ${colorClasses.border} ${colorClasses.hover}
                      ${feature.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                    `}
                  >
                    {!feature.available && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                          Segera Hadir
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses.bg}`}>
                        <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                      </div>
                      {feature.available && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                <span className="font-medium">Info:</span> Fitur yang tersedia disesuaikan dengan role Anda ({user?.role?.replace(/_/g, ' ').toUpperCase()}). 
                Beberapa fitur mungkin memerlukan izin tambahan atau akan tersedia dalam pembaruan mendatang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SecurityPage;