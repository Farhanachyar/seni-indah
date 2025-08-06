'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Star,
  Tag,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';

import { apiPost, ApiError } from '../../../../utils/apiClient';

interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price_regular: number;
  price_discount?: number;
  category_id: number;
  primary_image_url?: string;
  sku?: string;
  brand?: string;
  is_active: boolean;
  is_featured: boolean;
  stock_status: string;
  created_at: string;
  updated_at?: string;
  category_name?: string;
  category_slug?: string;
  category_path?: string;
  computed_meta_title?: string;
  computed_meta_description?: string;
  price_display: {
    regular: string;
    discount?: string;
    has_discount: boolean;
    percentage: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  filters: {
    search: string;
    category_id?: number;
    status: string;
    sort_by: string;
    sort_order: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  level: number;
}

const ProductsManagementPage: React.FC = () => {
  const { user } = useAuthContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    status: 'all',
    sort_by: 'created_at',
    sort_order: 'DESC'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  });

  useEffect(() => {
    if (user?.email) {
      document.title = `Management Products | ${user.email}`;
    } 
  }, [user?.email]);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const requestBody = {
        page,
        limit: 20,
        ...filters,
        category_id: filters.category_id ? parseInt(filters.category_id) : null
      };

      const result = await apiPost<ApiResponse<ProductsResponse>>(
        '/v1.0/admin/products',
        requestBody
      );

      if (result.success) {
        setProducts(result.data.products);
        setPagination(result.data.pagination);
        setCurrentPage(page);
      } else {
        throw new Error(typeof result.data === 'string' ? result.data : 'Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {

      const result = await apiPost<ApiResponse<any>>(
        '/v1.0/admin/categories',
        {}
      );

      if (result.success) {

        const flatCategories = flattenCategories(result.data.categories || []);
        setCategories(flatCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const flattenCategories = (categories: any[], level = 0): Category[] => {
    const flattened: Category[] = [];

    categories.forEach(cat => {
      flattened.push({
        id: cat.id,
        name: '—'.repeat(level) + ' ' + cat.name,
        slug: cat.slug,
        level: cat.level
      });

      if (cat.children && cat.children.length > 0) {
        flattened.push(...flattenCategories(cat.children, level + 1));
      }
    });

    return flattened;
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.title}"?`)) {
      return;
    }

    try {

      const result = await apiPost<ApiResponse<string>>(
        '/v1.0/admin/product/delete',
        { id: product.id }
      );

      if (result.success) {
        await fetchProducts(currentPage);
        setError('');
      } else {
        setError(result.data || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Delete failed');
      }
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    fetchProducts(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      status: 'all',
      sort_by: 'created_at',
      sort_order: 'DESC'
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const ProductImage: React.FC<{ product: Product; className: string }> = ({ product, className }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
      <div className={`relative bg-gray-100 ${className}`}>
        {product.primary_image_url && !imageError ? (
          <>
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${product.primary_image_url}`}
              alt={product.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {}
      <div className="relative">
        <ProductImage product={product} className="h-40 sm:h-48 lg:h-52" />

        {}
        <div className="absolute top-2 left-2 space-y-1">
          {product.is_featured && (
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              <Star className="w-3 h-3 mr-1" />
              Unggulan
            </span>
          )}
          {product.price_display.has_discount && (
            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              <Tag className="w-3 h-3 mr-1" />
              -{product.price_display.percentage}%
            </span>
          )}
        </div>

        {}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
            product.stock_status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {product.stock_status === 'in_stock' ? 'Tersedia' :
             product.stock_status === 'out_of_stock' ? 'Habis' : 'Pre-order'}
          </span>
        </div>
      </div>

      {}
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500">{product.category_name}</p>
        </div>

        {}
        <div className="mb-3">
          {product.price_display.has_discount ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
              <span className="text-sm sm:text-lg font-bold text-red-600">{product.price_display.discount}</span>
              <span className="text-xs sm:text-sm text-gray-500 line-through">{product.price_display.regular}</span>
            </div>
          ) : (
            <span className="text-sm sm:text-lg font-bold text-gray-900">{product.price_display.regular}</span>
          )}
        </div>

        {}
        <div className="space-y-1 mb-3 text-xs text-gray-600">
          {product.sku && (
            <div>SKU: <span className="font-medium">{product.sku}</span></div>
          )}
          {product.brand && (
            <div>Brand: <span className="font-medium">{product.brand}</span></div>
          )}
          <div>Dibuat: <span className="font-medium">{new Date(product.created_at).toLocaleDateString('id-ID')}</span></div>
        </div>

        {}
        <div className="flex items-center justify-between">
          <Link
            href={`/dashboard/management/products/edit/${product.slug}`}
            className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Edit</span>
          </Link>

          <button
            onClick={() => handleDelete(product)}
            className="flex items-center space-x-1 px-2 sm:px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductListItem = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {}
        <ProductImage product={product} className="w-20 h-20 rounded-lg flex-shrink-0" />

        {}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{product.category_name}</p>

              {}
              <div className="flex items-center space-x-2 mb-2">
                {product.price_display.has_discount ? (
                  <>
                    <span className="text-lg font-bold text-red-600">{product.price_display.discount}</span>
                    <span className="text-sm text-gray-500 line-through">{product.price_display.regular}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      -{product.price_display.percentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">{product.price_display.regular}</span>
                )}
              </div>

              {}
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                {product.sku && <span>SKU: {product.sku}</span>}
                {product.brand && <span>Brand: {product.brand}</span>}
                <span>{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
              </div>
            </div>

            {}
            <div className="flex flex-col items-end space-y-2 ml-4">
              {}
              <div className="flex flex-col items-end space-y-1">
                {product.is_featured && (
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    <Star className="w-3 h-3 mr-1" />
                    Unggulan
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.stock_status === 'in_stock' ? 'bg-green-100 text-green-800' :
                  product.stock_status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.stock_status === 'in_stock' ? 'Tersedia' :
                   product.stock_status === 'out_of_stock' ? 'Habis' : 'Pre-order'}
                </span>
              </div>

              {}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/dashboard/management/products/edit/${product.slug}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit produk"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(product)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                href="/dashboard/management"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Kembali ke Management</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Produk</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manajemen produk dan inventori</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/management/products/new"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk</span>
                </Link>
              </div>
            </div>
          </div>

          {}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {}
                <select
                  value={filters.category_id}
                  onChange={(e) => handleFilterChange('category_id', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {}
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="featured">Produk Unggulan</option>
                  <option value="discount">Ada Diskon</option>
                  <option value="out_of_stock">Stok Habis</option>
                </select>

                {}
                <select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sort_by, sort_order }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="created_at-DESC">Terbaru</option>
                  <option value="created_at-ASC">Terlama</option>
                  <option value="title-ASC">Nama A-Z</option>
                  <option value="title-DESC">Nama Z-A</option>
                  <option value="price_regular-ASC">Harga Terendah</option>
                  <option value="price_regular-DESC">Harga Tertinggi</option>
                </select>
              </div>

              {}
              <div className="flex items-center space-x-2">
                <button
                  onClick={applyFilters}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>

                {}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    title="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar Produk ({pagination.total})
                </h2>
                {loading && (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {products.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                      {products.map(renderProductCard)}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map(renderProductListItem)}
                    </div>
                  )}

                  {}
                  {pagination.total_pages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-gray-600 text-center sm:text-left">
                        Menampilkan {((currentPage - 1) * pagination.per_page) + 1} - {Math.min(currentPage * pagination.per_page, pagination.total)} dari {pagination.total} produk
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => fetchProducts(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="px-4 py-2 text-sm font-medium">
                          {currentPage} / {pagination.total_pages}
                        </span>

                        <button
                          onClick={() => fetchProducts(currentPage + 1)}
                          disabled={currentPage >= pagination.total_pages}
                          className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filters.search || filters.category_id || filters.status !== 'all' 
                      ? 'Tidak ada produk yang cocok' 
                      : 'Belum ada produk'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {filters.search || filters.category_id || filters.status !== 'all'
                      ? 'Coba ubah filter pencarian Anda'
                      : 'Mulai dengan menambahkan produk pertama Anda'}
                  </p>
                  <Link
                    href="/dashboard/management/products/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProductsManagementPage;