'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../components/AuthProvider';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import { 
  Package, 
  FolderTree, 
  Plus, 
  Settings, 
  ArrowLeft,
  Database,
  Loader2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

import { apiPost, ApiError } from '../../../utils/apiClient';

interface DashboardStats {
  total_products: number;
  total_categories: number;
  level_stats: {
    main_categories: number;
    sub_categories: number;
    sub_sub_categories: number;
    deeper_levels: number;        
    total_with_products: number;
    max_level: number;           
    level_breakdown: { [key: string]: number }; 
  };
  top_categories: Array<{
    name: string;
    slug: string;
    level: number;
    product_count: number;
  }>;
}

interface ManagementSummary {
  product_stats: {
    total: number;
    featured: number;
    with_discount: number;
    avg_price: number;
  };
  category_stats: {
    total: number;
    main_categories: number;
    sub_categories: number;
    sub_sub_categories: number;
  };
  stock_status: Array<{
    stock_status: string;
    count: number;
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const ManagementPage: React.FC = () => {
  const { user } = useAuthContext();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [managementSummary, setManagementSummary] = useState<ManagementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsResult, summaryResult] = await Promise.all([
          apiPost<ApiResponse<DashboardStats>>('/v1.0/management/dashboard-stats', {}),
          apiPost<ApiResponse<ManagementSummary>>('/v1.0/management/summary', {})
        ]);

        if (statsResult.success && summaryResult.success) {
          setDashboardStats(statsResult.data);
          setManagementSummary(summaryResult.data);
        } else {
          throw new Error('Invalid response from server');
        }

      } catch (err) {
        console.error('Error fetching management data:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user?.email) {
      document.title = `Management | ${user.email}`;
    } 
  }, [user?.email]);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data management...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const quickStats = [
    {
      title: 'Total Produk',
      value: dashboardStats?.total_products.toString() || '0',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Kategori',
      value: dashboardStats?.total_categories.toString() || '0',
      icon: FolderTree,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const managementOptions = [
    {
      title: 'Pengaturan Produk',
      description: 'Kelola semua produk, tambah produk baru, edit informasi produk, update harga, dan atur status produk',
      icon: Package,
      href: '/dashboard/management/products',
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      borderColor: 'border-blue-200',
      stats: {
        total: managementSummary?.product_stats.total || 0,
        featured: managementSummary?.product_stats.featured || 0,
        withDiscount: managementSummary?.product_stats.with_discount || 0,
        avgPrice: managementSummary?.product_stats.avg_price || 0
      },
      features: [
        'Tambah/Edit/Hapus Produk',
        'Upload Gambar Produk',
        'Atur Harga & Diskon',
        'Kelola Stok & Status',
        'SEO & Meta Description',
        'Produk Unggulan'
      ]
    },
    {
      title: 'Pengaturan Category',
      description: 'Kelola struktur kategori produk, buat kategori baru, atur hierarki kategori, dan update informasi kategori',
      icon: FolderTree,
      href: '/dashboard/management/categories',
      color: 'bg-green-100 text-green-600',
      hoverColor: 'hover:bg-green-50',
      borderColor: 'border-green-200',
      stats: {
        total: managementSummary?.category_stats.total || 0,
        main: managementSummary?.category_stats.main_categories || 0,
        sub: managementSummary?.category_stats.sub_categories || 0,
        subSub: managementSummary?.category_stats.sub_sub_categories || 0
      },
      features: [
        'Buat Kategori Baru',
        'Atur Hierarki Kategori',
        'Upload Gambar Kategori',
        'SEO Kategori',
        'Sorting & Ordering',
        'Status Aktif/Nonaktif'
      ]
    }
  ];

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Kembali ke Dashboard</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Management Center</h1>
                    <p className="text-sm sm:text-base text-gray-600">Kelola produk dan kategori sistem</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-500">Logged in as</p>
                  <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{user?.name}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user?.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'admin' ? 'bg-orange-100 text-orange-800' :
                    user?.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user?.role?.replace(/_/g, ' ').toUpperCase() || 'USER'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.title} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0 ml-2`}>
                      <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

           {}
          {dashboardStats?.level_stats && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Breakdown Kategori</h3>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Max Level: {dashboardStats.level_stats.max_level}
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    {dashboardStats.level_stats.main_categories}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Kategori Utama</div>
                  <div className="text-xs text-gray-400">Level 0</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {dashboardStats.level_stats.sub_categories}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Sub Kategori</div>
                  <div className="text-xs text-gray-400">Level 1</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    {dashboardStats.level_stats.sub_sub_categories}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Sub-Sub Kategori</div>
                  <div className="text-xs text-gray-400">Level 2</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">
                    {dashboardStats.level_stats.total_with_products}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Dengan Produk</div>
                  <div className="text-xs text-gray-400">All Levels</div>
                </div>
              </div>

              {}
              {dashboardStats.level_stats.deeper_levels > 0 && (
                <div className="mb-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">Level Lebih Dalam</h4>
                      <p className="text-xs sm:text-sm text-yellow-700">
                        {dashboardStats.level_stats.deeper_levels} kategori pada level 3+
                      </p>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {dashboardStats.level_stats.deeper_levels}
                    </div>
                  </div>
                </div>
              )}

              {}
              {dashboardStats.level_stats.level_breakdown && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Detail Per Level:</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                    {Object.entries(dashboardStats.level_stats.level_breakdown)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([level, count]) => (
                        <div key={level} className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border">
                          <div className="text-sm sm:text-lg font-bold text-gray-700">{count}</div>
                          <div className="text-xs text-gray-500">Level {level}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {managementOptions.map((option) => {
              const IconComponent = option.icon;

              return (
                <div 
                  key={option.title} 
                  className={`bg-white rounded-lg shadow-md border-2 ${option.borderColor} p-4 ${option.hoverColor} transition-all duration-200`}
                >
                  {}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg ${option.color} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">{option.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{option.description}</p>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-3 py-2 px-3 bg-gray-50 rounded">
                    {option.title === 'Pengaturan Produk' ? (
                      <>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{option.stats.total}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{option.stats.featured}</div>
                          <div className="text-gray-600">Unggulan</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-purple-600">{option.stats.withDiscount}</div>
                          <div className="text-gray-600">Diskon</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-orange-600 text-xs">
                            Rp {Math.round((option.stats.avgPrice || 0) / 1000)}k
                          </div>
                          <div className="text-gray-600">Avg</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{option.stats.total}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{option.stats.main}</div>
                          <div className="text-gray-600">Utama</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-purple-600">{option.stats.sub}</div>
                          <div className="text-gray-600">Sub</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-orange-600">{option.stats.subSub}</div>
                          <div className="text-gray-600">Sub-Sub</div>
                        </div>
                      </>
                    )}
                  </div>

                  {}
                  <div className="mb-4">
                    <div className="grid grid-cols-1 gap-1">
                      {option.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {option.features.length > 3 && (
                        <div className="text-xs text-gray-500 italic">
                          +{option.features.length - 3} fitur lainnya
                        </div>
                      )}
                    </div>
                  </div>

                  {}
                  <Link
                    href={option.href}
                    className={`inline-flex items-center justify-center w-full px-4 py-2 ${option.color.replace('text-', 'bg-').replace('-600', '-600')} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Akses {option.title}
                  </Link>
                </div>
              );
            })}
          </div>

          {}
          {dashboardStats?.top_categories && dashboardStats.top_categories.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Top Kategori (Berdasarkan Jumlah Produk)
              </h3>

              <div className="space-y-3">
                {dashboardStats.top_categories.slice(0, 5).map((category, index) => (
                  <div key={category.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{category.name}</p>
                        <p className="text-xs text-gray-500">Level {category.level}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{category.product_count}</p>
                      <p className="text-xs text-gray-500">produk</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ManagementPage;