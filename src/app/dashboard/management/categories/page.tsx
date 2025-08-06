'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Link from 'next/link';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';

import { apiPost, ApiError } from '../../../../utils/apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CategoriesResponse {
  categories: Category[];
  stats: any;
  total_count: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  level: number;
  full_path: string;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  children: Category[];
  product_count?: number;
  children_count?: number;
}

const getErrorMessage = (error: any): string => {
  console.log('=== ERROR MESSAGE DEBUG ===');
  console.log('Full error object:', error);

  if (error instanceof ApiError && error.data) {
    console.log('ApiError data (already decrypted):', error.data);
    console.log('ApiError data type:', typeof error.data);

    if (typeof error.data === 'object' && error.data !== null) {

      if (error.data.message) {
        console.log('Found message field:', error.data.message);
        return error.data.message;
      }

      if (error.data.error) {
        console.log('Found error field:', error.data.error);
        return error.data.error;
      }

      const possibleFields = ['msg', 'detail', 'details', 'description', 'reason'];
      for (const field of possibleFields) {
        if (error.data[field]) {
          const value = error.data[field];
          console.log(`Found ${field} field:`, value);

          if (typeof value === 'string') {
            return value;
          } else if (Array.isArray(value)) {
            return value.join(', ');
          }
        }
      }

      console.log('Available fields in error.data:', Object.keys(error.data));

      try {
        const stringified = JSON.stringify(error.data);
        if (stringified !== '{}' && stringified !== 'null') {
          console.log('Stringifying entire error data:', stringified);
          return stringified;
        }
      } catch (e) {
        console.log('Failed to stringify error data:', e);
      }
    }

    if (typeof error.data === 'string') {
      console.log('Error data is string:', error.data);
      return error.data;
    }
  }

  if (error instanceof ApiError && error.message) {
    console.log('Using ApiError message:', error.message);
    return error.message;
  }

  if (error instanceof Error && error.message) {
    console.log('Using Error message:', error.message);
    return error.message;
  }

  console.log('Using fallback message');
  console.log('=== END ERROR MESSAGE DEBUG ===');

  return 'Terjadi error. Hubungi administrator untuk perbaikan';
};

const AdminCategoriesPage: React.FC = () => {
  const { user } = useAuthContext();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const result = await apiPost<ApiResponse<CategoriesResponse | string>>(
        '/v1.0/admin/categories',
        {}
      );

      if (result.success) {
        const data = result.data as CategoriesResponse;
        setCategories(data.categories || []);
        setExpandedCategories(new Set());
      } else {
        const errorMessage = typeof result.data === 'string' ? result.data : 'Failed to load categories';
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmSlug('');
    setShowDeleteModal(true);
  };

  useEffect(() => {
      if (user?.email) {
        document.title = `Management Category | ${user.email}`;
      } 
    }, [user?.email]);

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete || deleteConfirmSlug !== categoryToDelete.slug) {
      return;
    }

    try {
      setIsDeleting(true);

      const result = await apiPost<ApiResponse<string>>(
        '/v1.0/admin/category/delete',
        { id: categoryToDelete.id }
      );

      if (result && result.success) {
        await fetchCategories();
        setError('');
      } else {
        const errorMessage = typeof result?.data === 'string' ? result.data : 'Delete failed. Pastikan Category Tidak Memiliki Sub Category / Produk';
        throw new Error(errorMessage);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (typeof err.data === 'object' && err.data) {

        }
      }

      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsDeleting(false);

      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setDeleteConfirmSlug('');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    };

    const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setDeleteConfirmSlug('');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  const toggleExpanded = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getCategoryNamePath = (category: Category, allCategories: Category[]): string[] => {
    const path: string[] = [];
    let current = category;

    while (current) {
      path.unshift(current.name);
      if (!current.parent_id) break;

      const findParent = (cats: Category[]): Category | null => {
        for (const cat of cats) {
          if (cat.id === current.parent_id) return cat;
          if (cat.children.length > 0) {
            const found = findParent(cat.children);
            if (found) return found;
          }
        }
        return null;
      };

      current = findParent(allCategories) as Category;
    }

    return path;
  };

  const filterCategories = (categories: Category[], term: string): Category[] => {
    if (!term) return categories;

    return categories.filter(category => {
      const matchesName = category.name.toLowerCase().includes(term.toLowerCase());
      const matchesDescription = category.description?.toLowerCase().includes(term.toLowerCase());
      const hasMatchingChildren = category.children.some(child => 
        filterCategories([child], term).length > 0
      );

      return matchesName || matchesDescription || hasMatchingChildren;
    });
  };

  const renderCategoryTree = (categories: Category[], level = 0, rootCategories: Category[] = []) => {
    const categoriesToUse = level === 0 ? categories : categories;
    const rootCats = level === 0 ? categories : rootCategories;
    const filteredCategories = filterCategories(categoriesToUse, searchTerm);

    return filteredCategories.map((category) => (
      <div key={category.id} className={`mb-3 ${level > 0 ? 'ml-2 sm:ml-4 md:ml-6' : ''}`}>
        <div className={`border rounded-lg shadow-sm ${
          level === 0 ? 'border-blue-200 bg-blue-50' : 
          level === 1 ? 'border-green-200 bg-green-50' : 
          level === 2 ? 'border-purple-200 bg-purple-50' : 
          'border-orange-200 bg-orange-50'
        }`}>
          <div className="p-3 sm:p-4">
            {}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start flex-1 min-w-0">
                {}
                {category.children.length > 0 && (
                  <button
                    onClick={() => toggleExpanded(category.id)}
                    className="mr-2 mt-1 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  >
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                )}

                {}
                <div className={`px-2 py-1 rounded-full text-xs font-semibold mr-2 mt-0.5 flex-shrink-0 ${
                  level === 0 ? 'bg-blue-100 text-blue-800' : 
                  level === 1 ? 'bg-green-100 text-green-800' : 
                  level === 2 ? 'bg-purple-100 text-purple-800' : 
                  'bg-orange-100 text-orange-800'
                }`}>
                  {level === 0 ? 'UTAMA' : 
                   level === 1 ? 'SUB' : 
                   level === 2 ? 'SUB-SUB' : 
                   `LV${level}`}
                </div>

                {}
                {category.image && (
                  <div className="mr-3 flex-shrink-0">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${category.image}`}
                      alt={category.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                )}

                {}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start flex-wrap gap-2 mb-2">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-lg break-words">
                      {category.name}
                    </h4>
                    {!category.is_active && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex-shrink-0">
                        NONAKTIF
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                <Link
                  href={`/dashboard/management/categories/${category.id}/edit`}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit kategori"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Hapus kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {}
            <div className="space-y-2">
              {}
              <div className="flex items-start">
                <span className="font-medium text-gray-700 text-xs sm:text-sm mr-2 flex-shrink-0">Path:</span>
                <div className="flex items-center flex-wrap gap-1">
                  {getCategoryNamePath(category, rootCats).map((name, index, array) => (
                    <div key={index} className="flex items-center">
                      <span className="bg-white px-2 py-1 rounded border text-xs sm:text-sm font-medium text-gray-700">
                        {name}
                      </span>
                      {index < array.length - 1 && (
                        <ChevronRight className="w-3 h-3 mx-1 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="flex items-center flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
                {category.children.length > 0 && (
                  <span className="flex items-center">
                    <FolderTree className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {category.children.length} sub-kategori
                  </span>
                )}
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Sort: {category.sort_order}
                </span>
                <span className="text-gray-500">
                  {new Date(category.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short', 
                    year: 'numeric'
                  })}
                </span>
              </div>

              {}
              {category.description && (
                <div className="mt-2 p-2 bg-white rounded border border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-700 italic">"{category.description}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        {expandedCategories.has(category.id) && category.children.length > 0 && (
          <div className="mt-2">
            {renderCategoryTree(category.children, level + 1, rootCats)}
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat kategori...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                href="/dashboard/management"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Kembali ke Management</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FolderTree className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Kategori</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manajemen kategori produk dengan hierarki</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/management/categories/new"
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kategori</span>
                </Link>
              </div>
            </div>
          </div>

          {}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}

          {}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari kategori..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Daftar Kategori</h2>
                  <p className="text-sm text-gray-600">
                    Total: {categories.length} kategori
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedCategories(new Set())}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Tutup Semua
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => {
                      const allIds = new Set<number>();
                      const collectIds = (cats: Category[]) => {
                        cats.forEach(cat => {
                          if (cat.children.length > 0) {
                            allIds.add(cat.id);
                            collectIds(cat.children);
                          }
                        });
                      };
                      collectIds(categories);
                      setExpandedCategories(allIds);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Buka Semua
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {categories.length > 0 ? (
                <div className="space-y-2">
                  {renderCategoryTree(categories)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada kategori</h3>
                  <p className="text-gray-600 mb-4">Mulai dengan membuat kategori pertama Anda</p>
                  <Link
                    href="/dashboard/management/categories/new"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kategori
                  </Link>
                </div>
              )}
            </div>
          </div>

          {}
          {showDeleteModal && categoryToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  {}
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Konfirmasi Penghapusan</h3>
                      <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
                    </div>
                  </div>

                  {}
                  <div className="mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-red-800 font-semibold mb-1">PERINGATAN KERAS!</p>
                          <p className="text-red-700 mb-2">
                            Menghapus kategori "<span className="font-bold">{categoryToDelete.name}</span>" akan:
                          </p>
                          <ul className="text-red-700 text-xs space-y-1 ml-4">
                            <li>• Menghapus SEMUA produk dalam kategori ini</li>
                            <li>• Menghapus SEMUA sub-kategori dan produknya</li>
                            <li>• Menghapus gambar kategori dari server</li>
                            <li>• Data yang dihapus TIDAK DAPAT dipulihkan</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nama Kategori:</span>
                          <span className="font-medium">{categoryToDelete.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Slug:</span>
                          <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{categoryToDelete.slug}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level:</span>
                          <span className="font-medium">
                            {categoryToDelete.level === 0 ? 'Kategori Utama' : `Sub Level ${categoryToDelete.level}`}
                          </span>
                        </div>
                        {categoryToDelete.children.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sub Kategori:</span>
                            <span className="font-medium text-red-600">{categoryToDelete.children.length} kategori</span>
                          </div>
                        )}
                        {categoryToDelete.product_count !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Produk:</span>
                            <span className="font-medium text-red-600">{categoryToDelete.product_count} produk</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Untuk konfirmasi, ketik slug kategori: 
                        <span className="font-mono text-red-600 bg-red-100 px-2 py-1 rounded ml-1">
                          {categoryToDelete.slug}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmSlug}
                        onChange={(e) => setDeleteConfirmSlug(e.target.value)}
                        placeholder={`Ketik: ${categoryToDelete.slug}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                        autoComplete="off"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Slug harus persis sama dengan yang ditampilkan di atas (case-sensitive)
                      </p>
                    </div>
                  </div>

                  {}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDeleteCancel}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={isDeleting}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={deleteConfirmSlug !== categoryToDelete.slug || isDeleting}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Menghapus...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus Permanen
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminCategoriesPage;