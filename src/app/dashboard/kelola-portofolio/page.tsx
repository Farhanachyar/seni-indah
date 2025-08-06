'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  ImageIcon,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuthContext } from '../../../components/AuthProvider';
import ProtectedRoute from '../../../components/ProtectedRoute';

import { apiPost, ApiError } from '../../../utils/apiClient';

interface Gallery {
  id: number;
  slug: string;
  post_title: string;
  category: string;
  location?: string;
  deskripsi?: string;
  tanggal_unggahan?: string;
  style_view: string;
  thumbnail?: string;
  image_url1?: string;
  image_url2?: string;
  image_url3?: string;
  video_url1?: string;
  created_at: string;
  updated_at: string;
}

interface GalleryResponse {
  galleries: Gallery[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const DeleteModal: React.FC<{
  isOpen: boolean;
  gallery: Gallery | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}> = ({ isOpen, gallery, onClose, onConfirm, isDeleting }) => {
  const [confirmSlug, setConfirmSlug] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmSlug('');
    }
  }, [isOpen]);

  if (!isOpen || !gallery) return null;

  const canDelete = confirmSlug === gallery.slug;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
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
                  <p className="text-red-800 font-semibold mb-1">PERINGATAN!</p>
                  <p className="text-red-700 mb-2">
                    Menghapus portofolio "<span className="font-bold">{gallery.post_title}</span>" akan:
                  </p>
                  <ul className="text-red-700 text-xs space-y-1 ml-4">
                    <li>• Menghapus semua gambar dan video</li>
                    <li>• Menghapus data portofolio secara permanen</li>
                    <li>• Data yang dihapus TIDAK DAPAT dipulihkan</li>
                  </ul>
                </div>
              </div>
            </div>

            {}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Judul:</span>
                  <span className="font-medium">{gallery.post_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slug:</span>
                  <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{gallery.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="font-medium">{gallery.category}</span>
                </div>
              </div>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Untuk konfirmasi, ketik slug portofolio: 
                <span className="font-mono text-red-600 bg-red-100 px-2 py-1 rounded ml-1">
                  {gallery.slug}
                </span>
              </label>
              <input
                type="text"
                value={confirmSlug}
                onChange={(e) => setConfirmSlug(e.target.value)}
                placeholder={`Ketik: ${gallery.slug}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                autoComplete="off"
              />
            </div>
          </div>

          {}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isDeleting}
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={!canDelete || isDeleting}
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
  );
};

const KelolaPortofolioPage: React.FC = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.email) {
      document.title = `Portofolio Manager | ${user.email}`;
    } 
  }, [user?.email]);

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [expandedActions, setExpandedActions] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    style_view: '',
    sort_by: 'created_at',
    sort_order: 'DESC'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);

  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return '';

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
    const separator = imagePath.startsWith('/') ? '' : '/';
    return `${baseUrl}${separator}${imagePath}`;
  };

  const fetchGalleries = async (page = 1) => {
    try {
      setLoading(true);

      const requestBody = {
        page,
        limit: 12,
        ...filters
      };

      const result = await apiPost<ApiResponse<GalleryResponse>>(
        '/v1.0/admin/galleries',
        requestBody
      );

      if (result.success) {
        setGalleries(result.data.galleries);
        setPagination(result.data.pagination);
        setCurrentPage(page);

        const categorySet = new Set(result.data.galleries.map(g => g.category).filter(Boolean));
        const uniqueCategories = Array.from(categorySet);
        setCategories(uniqueCategories);
      } else {
        throw new Error(typeof result.data === 'string' ? result.data : 'Failed to load galleries');
      }
    } catch (err) {
      console.error('Error fetching galleries:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load galleries');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchGalleries(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      style_view: '',
      sort_by: 'created_at',
      sort_order: 'DESC'
    });
    setCurrentPage(1);
    setTimeout(() => fetchGalleries(1), 0);
  };

  const handleDelete = (gallery: Gallery) => {
    setGalleryToDelete(gallery);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!galleryToDelete) return;

    try {
      setIsDeleting(true);
      const result = await apiPost<ApiResponse<string>>(
        '/v1.0/admin/gallery/delete',
        { 
          id: galleryToDelete.id,           
          slug: galleryToDelete.slug, 
          confirm_slug: galleryToDelete.slug 
        }
      );

      if (result.success) {
        setSuccess('Portofolio berhasil dihapus');
        fetchGalleries(currentPage);
        setShowDeleteModal(false);
        setGalleryToDelete(null);
      } else {
        setError(result.data || 'Gagal menghapus portofolio');
      }
    } catch (err) {
      console.error('Delete error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Gagal menghapus portofolio');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const renderGalleryCard = (gallery: Gallery) => (
    <div key={gallery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {gallery.thumbnail || gallery.image_url1 ? (
          <div className="w-full h-full relative">
            <img
              src={getImageUrl(gallery.thumbnail || gallery.image_url1)}
              alt={gallery.post_title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              style={{
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          </div>
        )}

        {}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
            {gallery.style_view}
          </span>
        </div>
      </div>

      {}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
          {gallery.post_title}
        </h3>

        <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-3">
          <p><span className="font-medium">Kategori:</span> {gallery.category}</p>
          {gallery.location && (
            <p className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{gallery.location}</span>
            </p>
          )}
          {gallery.tanggal_unggahan && (
            <p className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{new Date(gallery.tanggal_unggahan).toLocaleDateString('id-ID')}</span>
            </p>
          )}
        </div>

        {}
        {gallery.deskripsi && (
          <div className="mb-3 flex-1">
            <div 
              className="text-xs sm:text-sm text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ 
                __html: gallery.deskripsi.replace(/<[^>]*>/g, '').substring(0, 120) + (gallery.deskripsi.length > 120 ? '...' : '')
              }}
            />
          </div>
        )}

        {}
        <div className="mt-auto grid grid-cols-3 gap-1 sm:gap-2">
          <Link
            href={`/post/${gallery.slug}`}
            target="_blank"
            className="flex items-center justify-center px-1 py-1.5 sm:px-2 sm:py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Lihat</span>
          </Link>

          <Link
            href={`/dashboard/kelola-portofolio/${gallery.slug}/edit`}
            className="flex items-center justify-center px-1 py-1.5 sm:px-2 sm:py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Link>

          <button
            onClick={() => handleDelete(gallery)}
            className="flex items-center justify-center px-1 py-1.5 sm:px-2 sm:py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderGalleryListItem = (gallery: Gallery) => {
    const isExpanded = expandedActions === gallery.id;

    return (
      <div key={gallery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          {}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 relative flex-shrink-0 overflow-hidden">
            {gallery.thumbnail || gallery.image_url1 ? (
              <div className="w-full h-full relative">
                <img
                  src={getImageUrl(gallery.thumbnail || gallery.image_url1)}
                  alt={gallery.post_title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center center'
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
            )}

            {}
            <div className="absolute top-1 left-1">
              <span className="px-1.5 py-0.5 bg-black bg-opacity-70 text-white text-xs rounded">
                {gallery.style_view}
              </span>
            </div>
          </div>

          {}
          <div className="flex-1 p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-lg line-clamp-2">
                  {gallery.post_title}
                </h3>

                <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-2">
                  <p><span className="font-medium">Kategori:</span> {gallery.category}</p>
                  {gallery.location && (
                    <p className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{gallery.location}</span>
                    </p>
                  )}
                  {gallery.tanggal_unggahan && (
                    <p className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span>{new Date(gallery.tanggal_unggahan).toLocaleDateString('id-ID')}</span>
                    </p>
                  )}
                </div>

                {}
                {gallery.deskripsi && (
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="text-xs sm:text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: gallery.deskripsi.length > 150 
                          ? gallery.deskripsi.substring(0, 150) + '...' 
                          : gallery.deskripsi 
                      }}
                    />
                  </div>
                )}
              </div>

              {}
              <div className="ml-3 flex-shrink-0">
                {}
                <div className="hidden sm:flex flex-col gap-2">
                  <Link
                    href={`/post/${gallery.slug}`}
                    target="_blank"
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Lihat
                  </Link>

                  <Link
                    href={`/dashboard/kelola-portofolio/${gallery.slug}/edit`}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(gallery)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </button>
                </div>

                {}
                <div className="sm:hidden">
                  <button
                    onClick={() => setExpandedActions(isExpanded ? null : gallery.id)}
                    className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        {isExpanded && (
          <div className="sm:hidden border-t border-gray-200 p-3 bg-gray-50">
            <div className="grid grid-cols-3 gap-2">
              <Link
                href={`/post/${gallery.slug}`}
                target="_blank"
                className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setExpandedActions(null)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Lihat
              </Link>

              <Link
                href={`/dashboard/kelola-portofolio/${gallery.slug}/edit`}
                className="flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setExpandedActions(null)}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Link>

              <button
                onClick={() => {
                  setExpandedActions(null);
                  handleDelete(gallery);
                }}
                className="flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </div>

          {}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Kelola Portofolio
                </h1>
                <p className="text-gray-600">
                  Kelola dan atur portofolio galeri foto dan video
                </p>
              </div>

              <Link
                href="/dashboard/kelola-portofolio/new"
                className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Portofolio
              </Link>
            </div>

            {}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pencarian
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Cari judul portofolio..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tampilan
                  </label>
                  <select
                    value={filters.style_view}
                    onChange={(e) => handleFilterChange('style_view', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Semua Tampilan</option>
                    <option value="1-Grid">1-Grid</option>
                    <option value="3-Grid">3-Grid</option>
                  </select>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutkan
                  </label>
                  <select
                    value={`${filters.sort_by}-${filters.sort_order}`}
                    onChange={(e) => {
                      const [sort_by, sort_order] = e.target.value.split('-');
                      setFilters(prev => ({ ...prev, sort_by, sort_order }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="created_at-DESC">Terbaru</option>
                    <option value="created_at-ASC">Terlama</option>
                    <option value="post_title-ASC">Judul A-Z</option>
                    <option value="post_title-DESC">Judul Z-A</option>
                  </select>
                </div>
              </div>

              {}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={applyFilters}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Terapkan Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Tampilan:</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </button>
                </div>
              </div>

              {!loading && galleries.length > 0 && (
                <div className="text-sm text-gray-600">
                  Menampilkan {galleries.length} dari {pagination.total} portofolio
                </div>
              )}
            </div>
          </div>

          {}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Memuat portofolio...</p>
              </div>
            </div>
          )}

          {}
          {!loading && (
            <>
              {galleries.length > 0 ? (
                <>
                  {}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-8">
                      {galleries.map(renderGalleryCard)}
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      {galleries.map(renderGalleryListItem)}
                    </div>
                  )}

                  {}
                  {pagination.total_pages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => fetchGalleries(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage <= 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                          let pageNumber;
                          if (pagination.total_pages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= pagination.total_pages - 2) {
                            pageNumber = pagination.total_pages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => fetchGalleries(pageNumber)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                pageNumber === currentPage
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => fetchGalleries(currentPage + 1)}
                        disabled={currentPage >= pagination.total_pages}
                        className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage >= pagination.total_pages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="hidden sm:inline">Selanjutnya</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Belum Ada Portofolio
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Mulai dengan menambahkan portofolio pertama Anda
                  </p>
                  <Link
                    href="/dashboard/kelola-portofolio/new"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Portofolio
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {}
      <DeleteModal
        isOpen={showDeleteModal}
        gallery={galleryToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setGalleryToDelete(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </ProtectedRoute>
  );
};

export default KelolaPortofolioPage;