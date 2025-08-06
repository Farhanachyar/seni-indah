'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import TinyMCEEditor from '../../../../components/TinyMCEEditor';
import CollapsibleSection from '../../../../components/CollapsibleSection';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApiService, { ApiResponse as HttpApiResponse } from '../../../../lib/HttpRequests';
import { 
  Image as ImageIcon, 
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertTriangle,
  Loader2,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Info,
  Video,
  Calendar,
  Folder,
  Grid,
  Grid3X3,
  Star
} from 'lucide-react';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryResponse {
  categories: CategoryOption[];
  total: number;
}

interface AlternativeCategoryResponse {
  success: boolean;
  data: CategoryOption[] | { categories: CategoryOption[] } | string[] | any;
  error?: string;
  message?: string;
}

const NewPortofolioPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
      if (user?.email) {
        document.title = `New Portofolio | ${user.email}`;
      } 
    }, [user?.email]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [useCalendar, setUseCalendar] = useState(false);

  const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [formData, setFormData] = useState({
    post_title: '',
    category: '',
    location: '',
    deskripsi: '',
    tanggal_unggahan: '',
    style_view: '1-Grid'
  });

  const [currentImages, setCurrentImages] = useState<(File | null)[]>(new Array(30).fill(null));
  const [imagePreviewUrls, setImagePreviewUrls] = useState<(string | null)[]>(new Array(30).fill(null));
  const [currentVideos, setCurrentVideos] = useState<(File | null)[]>(new Array(15).fill(null));
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<(string | null)[]>(new Array(15).fill(null));
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(-1);

  const loadCategories = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('❌ No auth token found for loading categories');
      return;
    }

    try {
      setLoadingCategories(true);
      console.log('🔄 Loading categories...');

      ApiService.setAuthToken(token);

      const response: HttpApiResponse<CategoryResponse | CategoryOption[] | string[] | any> = await ApiService.post(
        '/v1.0/admin/gallery/categories',
        {}
      );

      console.log('📥 Categories API Response:', response);

      if (response.success && response.data) {
        console.log('✅ Response successful, checking data structure:', response.data);

        if (hasCategories(response.data) && Array.isArray(response.data.categories)) {
          console.log('✅ Found categories array:', response.data.categories.length, 'items');
          const categories = response.data.categories.map(convertToCategory);
          setAvailableCategories(categories);
        } 

        else if (Array.isArray(response.data)) {
          console.log('✅ Response data is array directly:', response.data.length, 'items');
          const categories = response.data.map(convertToCategory);
          setAvailableCategories(categories);
        }

        else if (response.data && typeof response.data === 'object') {
          console.log('🔍 Checking alternative response structures...');
          console.log('Response data keys:', Object.keys(response.data));

          const possibleArrays = Object.values(response.data).filter((val: any) => Array.isArray(val));
          if (possibleArrays.length > 0) {
            console.log('✅ Found array in response:', possibleArrays[0]);
            const categories = (possibleArrays[0] as any[]).map(convertToCategory);
            setAvailableCategories(categories);
          } else {
            console.log('❌ No categories array found in response');
            setAvailableCategories([]);
          }
        } else {
          console.log('❌ Invalid response data structure');
          setAvailableCategories([]);
        }
      } else {
        console.error('❌ API response not successful:', response.error || 'Unknown error');
        setAvailableCategories([]);
      }
    } catch (err) {
      console.error('❌ Load categories error:', err);
      setAvailableCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []); 

  const loadCategoriesFallback = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      console.log('🔄 Trying fallback method to load categories...');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';

      const response = await fetch(`${baseUrl}/v1.0/admin/gallery/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const result = await response.json() as AlternativeCategoryResponse;
      console.log('📥 Fallback Categories Response:', result);

      if (result.success && result.data) {

        let categories: CategoryOption[] = [];

        if (Array.isArray(result.data)) {

          categories = result.data.map(convertToCategory);
        } else if (hasCategories(result.data)) {

          categories = result.data.categories.map(convertToCategory);
        }

        if (categories.length > 0) {
          console.log('✅ Fallback method found categories:', categories);
          setAvailableCategories(categories);
        }
      }
    } catch (err) {
      console.error('❌ Fallback categories error:', err);
    }
  }, []); 

  useEffect(() => {
    const initializeComponent = async () => {

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';
      ApiService.setBaseUrl(baseUrl);

      const token = localStorage.getItem('auth_token');
      if (token) {
        ApiService.setAuthToken(token);
      }

      setLoadingCategories(true);
      try {
        await loadCategories();

        if (availableCategories.length === 0) {
          await loadCategoriesFallback();
        }
      } catch (error) {
        console.error('Error loading categories:', error);

        await loadCategoriesFallback();
      } finally {
        setLoadingCategories(false);
      }
    };

    initializeComponent();
  }, [loadCategories, loadCategoriesFallback]); 

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'category') {

      if (isNewCategory && value !== formData.category) {
        setSelectedCategoryOption('');
      }
    }
  };

  const handleCategoryDropdownChange = (value: string) => {
    if (value === 'new_category') {
      setIsNewCategory(true);
      setSelectedCategoryOption('new_category');
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setIsNewCategory(false);
      setSelectedCategoryOption(value);

      const selectedCategory = getSafeCategories().find(cat => cat.value === value);
      setFormData(prev => ({ 
        ...prev, 
        category: selectedCategory ? selectedCategory.value : value 
      }));
    }
  };

  const handleSwitchToManualInput = () => {
    setIsNewCategory(true);
    setSelectedCategoryOption('new_category');
    setFormData(prev => ({ ...prev, category: '' }));
  };

  const handleSwitchToDropdown = () => {
    setIsNewCategory(false);
    setSelectedCategoryOption('');
    setFormData(prev => ({ ...prev, category: '' }));
  };

  const getSafeCategories = () => {
    return availableCategories && Array.isArray(availableCategories) ? availableCategories : [];
  };

  const isValidCategoryOption = (item: any): item is CategoryOption => {
    return item && typeof item === 'object' && typeof item.value === 'string' && typeof item.label === 'string';
  };

  const hasCategories = (data: any): data is { categories: any[] } => {
    return data && typeof data === 'object' && 'categories' in data && Array.isArray(data.categories);
  };

  const convertToCategory = (item: any): CategoryOption => {
    if (typeof item === 'string') {
      return { value: item, label: item };
    } else if (isValidCategoryOption(item)) {
      return item;
    } else if (item && typeof item === 'object' && item.category) {
      return { value: item.category, label: item.category };
    } else {
      return { value: String(item), label: String(item) };
    }
  };

  const handleImageUpload = (index: number, file: File) => {

    const previewUrl = URL.createObjectURL(file);

    setCurrentImages(prev => {
      const newImages = [...prev];
      newImages[index] = file;
      return newImages;
    });

    setImagePreviewUrls(prev => {
      const newPreviews = [...prev];

      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]!);
      }
      newPreviews[index] = previewUrl;
      return newPreviews;
    });
  };

  const handleVideoUpload = (index: number, file: File) => {

    const previewUrl = URL.createObjectURL(file);

    setCurrentVideos(prev => {
      const newVideos = [...prev];
      newVideos[index] = file;
      return newVideos;
    });

    setVideoPreviewUrls(prev => {
      const newPreviews = [...prev];

      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]!);
      }
      newPreviews[index] = previewUrl;
      return newPreviews;
    });
  };

  const handleImageDelete = (index: number) => {

    if (index === thumbnailIndex) {
      setThumbnailIndex(-1);
    }

    if (imagePreviewUrls[index]) {
      URL.revokeObjectURL(imagePreviewUrls[index]!);
    }

    setCurrentImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });

    setImagePreviewUrls(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const handleVideoDelete = (index: number) => {

    if (videoPreviewUrls[index]) {
      URL.revokeObjectURL(videoPreviewUrls[index]!);
    }

    setCurrentVideos(prev => {
      const newVideos = [...prev];
      newVideos[index] = null;
      return newVideos;
    });

    setVideoPreviewUrls(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });
  };

  const handleThumbnailSelect = (index: number) => {
    setThumbnailIndex(index);
  };

  const validateForm = () => {
    if (!formData.post_title.trim()) {
      setError('Judul portofolio harus diisi');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Kategori harus diisi');
      return false;
    }

    const hasImages = currentImages.some(img => img !== null);
    if (!hasImages) {
      setError('Minimal satu gambar harus diunggah');
      return false;
    }

    if (isNewCategory && formData.category.trim().length < 2) {
      setError('Nama kategori baru minimal 2 karakter');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('auth_token');
    if (!validateForm() || !token) return;

    setSaving(true);
    setError('');

    try {

      ApiService.setAuthToken(token);

      const formDataToSend = new FormData();

      formDataToSend.append('post_title', formData.post_title.trim());
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('is_new_category', isNewCategory.toString()); 
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('deskripsi', formData.deskripsi.trim());
      formDataToSend.append('tanggal_unggahan', formData.tanggal_unggahan.trim());
      formDataToSend.append('style_view', formData.style_view);
      formDataToSend.append('thumbnail_index', thumbnailIndex.toString());

      for (let i = 0; i < 30; i++) {
        if (currentImages[i]) {
          formDataToSend.append(`image_${i + 1}`, currentImages[i]!);
        }
      }

      for (let i = 0; i < 15; i++) {
        if (currentVideos[i]) {
          formDataToSend.append(`video_${i + 1}`, currentVideos[i]!);
        }
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';

      const response = await fetch(`${baseUrl}/v1.0/admin/gallery/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`

        },
        body: formDataToSend
      });

      const result = await response.json() as ApiResponse<any>;

      if (result.success) {
        setSuccess('Portofolio berhasil dibuat');

        if (isNewCategory) {
          await loadCategories();
        }

        setTimeout(() => {
          router.push(`/dashboard/kelola-portofolio/${result.data.gallery.slug}/edit`);
        }, 2000);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal membuat portofolio');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan portofolio');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setFormData({
      post_title: '',
      category: '',
      location: '',
      deskripsi: '',
      tanggal_unggahan: '',
      style_view: '1-Grid'
    });

    imagePreviewUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    videoPreviewUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });

    setCurrentImages(new Array(30).fill(null));
    setImagePreviewUrls(new Array(30).fill(null));
    setCurrentVideos(new Array(15).fill(null));
    setVideoPreviewUrls(new Array(15).fill(null));
    setThumbnailIndex(-1);
    setError('');
    setSuccess('');
    setShowCategorySuggestions(false);

    setIsNewCategory(false);
    setSelectedCategoryOption('');

    if (getSafeCategories().length === 0) {
      loadCategories();
    }
  };

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
      videoPreviewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviewUrls, videoPreviewUrls]);

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                href="/dashboard/kelola-portofolio"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Kembali ke Kelola Portofolio</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buat Portofolio Baru</h1>
                    <p className="text-sm sm:text-base text-gray-600">Tambahkan portofolio baru dengan gambar dan video</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear Form
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Menyimpan...' : 'Simpan Portofolio'}</span>
                  </button>
                </div>
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

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          {}
          {(thumbnailIndex === -1 || !currentImages[thumbnailIndex]) && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Thumbnail harus dipilih dari salah satu gambar sebelum portofolio dapat disimpan
            </div>
          )}

          {}
          <div className="space-y-6">
            {}
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Portofolio *
                  </label>
                  <input
                    type="text"
                    value={formData.post_title}
                    onChange={(e) => handleFormChange('post_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Judul portofolio"
                    required
                  />
                  {formData.post_title && (
                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <Info className="w-4 h-4 inline mr-1 text-blue-600" />
                      <span className="text-blue-700">
                        Slug: <strong>{generateSlug(formData.post_title)}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Kategori *
                    </label>
                    <div className="flex items-center space-x-2">
                      {loadingCategories && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          Loading...
                        </div>
                      )}
                      {getSafeCategories().length > 0 && (
                        <button
                          type="button"
                          onClick={isNewCategory ? handleSwitchToDropdown : handleSwitchToManualInput}
                          className="text-xs text-purple-600 hover:text-purple-700 flex items-center transition-colors"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {isNewCategory ? 'Pilih dari Daftar' : 'Kategori Baru'}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isNewCategory && getSafeCategories().length > 0 ? (

                    <select
                      value={selectedCategoryOption}
                      onChange={(e) => handleCategoryDropdownChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      required
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {getSafeCategories().map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label} ({category.value})
                        </option>
                      ))}
                      <option value="new_category" className="font-medium text-purple-600">
                        ➕ Tambah Kategori Baru
                      </option>
                    </select>
                  ) : (

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleFormChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={
                          loadingCategories ? "Loading categories..." :
                          isNewCategory ? "Masukkan kategori baru" : 
                          getSafeCategories().length === 0 ? "Masukkan kategori (belum ada kategori tersimpan)" :
                          "Kategori portofolio"
                        }
                        required
                      />
                      {isNewCategory && (
                        <div className="flex items-center text-xs text-blue-600 bg-blue-50 p-2 rounded">
                          <Info className="w-3 h-3 mr-1" />
                          Kategori baru akan disimpan dan tersedia untuk portofolio selanjutnya
                        </div>
                      )}
                      {!loadingCategories && getSafeCategories().length === 0 && !isNewCategory && (
                        <div className="flex items-center justify-between text-xs text-orange-600 bg-orange-50 p-2 rounded">
                          <div className="flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Belum ada kategori tersimpan. Kategori pertama akan otomatis tersimpan.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              loadCategories();
                              loadCategoriesFallback();
                            }}
                            className="ml-2 px-2 py-1 bg-orange-100 hover:bg-orange-200 rounded text-orange-700 transition-colors"
                          >
                            Reload
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {}
                  {formData.category && (
                    <div className="mt-1 text-xs text-gray-600">
                      {isNewCategory ? (
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          Kategori baru: <strong className="ml-1">{formData.category}</strong>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Check className="w-3 h-3 mr-1 text-green-500" />
                          Kategori terpilih: <strong className="ml-1">{formData.category}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Lokasi proyek"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Tanggal Unggahan
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseCalendar(!useCalendar)}
                      className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {useCalendar ? 'Input Manual' : 'Pakai Calendar'}
                    </button>
                  </div>

                  {useCalendar ? (
                    <input
                      type="date"
                      value={formData.tanggal_unggahan}
                      onChange={(e) => handleFormChange('tanggal_unggahan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <>
                      <input
                        type="text"
                        value={formData.tanggal_unggahan}
                        onChange={(e) => handleFormChange('tanggal_unggahan', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Contoh: 25 Juli 2025 atau 25/07/2025"
                      />
                      <div className="mt-1 text-xs text-gray-500">
                        Format bebas: DD/MM/YYYY, DD-MM-YYYY, atau tulisan manual
                      </div>
                    </>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style View
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="style_view"
                        value="1-Grid"
                        checked={formData.style_view === '1-Grid'}
                        onChange={(e) => handleFormChange('style_view', e.target.value)}
                        className="mr-2"
                      />
                      <Grid className="w-4 h-4 mr-1" />
                      1-Grid
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="style_view"
                        value="3-Grid"
                        checked={formData.style_view === '3-Grid'}
                        onChange={(e) => handleFormChange('style_view', e.target.value)}
                        className="mr-2"
                      />
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      3-Grid
                    </label>
                  </div>
                </div>
              </div>

              {}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <TinyMCEEditor
                  value={formData.deskripsi}
                  onChange={(content) => handleFormChange('deskripsi', content)}
                  placeholder="Masukan deskripsi portofolio..."
                />
              </div>
            </div>

            {}
            <CollapsibleSection
              title="Gambar Portofolio"
              icon={<ImageIcon className="w-5 h-5" />}
              defaultOpen={true}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Unggah hingga 30 gambar. Gambar pertama akan menjadi thumbnail secara default.
                  </span>
                  {thumbnailIndex >= 0 && (
                    <>
                      <span className="text-sm text-green-600 flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Thumbnail: Gambar {thumbnailIndex + 1}
                      </span>
                    </>
                  )}
                </div>

                {}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 30 }, (_, index) => {
                    const currentImage = currentImages[index];
                    const previewUrl = imagePreviewUrls[index];
                    const isThumb = index === thumbnailIndex;

                    return (
                      <div key={index} className="relative">
                        <div className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-all duration-200 ${
                          isThumb ? 'border-green-300 bg-green-50 ring-2 ring-green-200' : 
                          index === 0 && !currentImage ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {currentImage && previewUrl ? (
                            <div className="relative w-full h-full">
                              <img
                                src={previewUrl}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleThumbnailSelect(index)}
                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                                    title="Set as thumbnail"
                                  >
                                    <Star className={`w-4 h-4 ${isThumb ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                                  </button>
                                  <button
                                    onClick={() => handleImageDelete(index)}
                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100"
                                    title="Delete image"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-xs text-gray-500">
                                {index === 0 ? 'Gambar 1*' : `Gambar ${index + 1}`}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(index, file);

                                    if (index === 0) {
                                      setThumbnailIndex(0);
                                    }
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>

                        {isThumb && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        )}

                        {index === 0 && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                              Wajib
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>

            {}
            <CollapsibleSection
              title="Video Portofolio"
              icon={<Video className="w-5 h-5" />}
              defaultOpen={false}
            >
              <div className="space-y-4">
                <span className="text-sm text-gray-600">
                  Unggah hingga 15 video (opsional).
                </span>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }, (_, index) => {
                    const currentVideo = currentVideos[index];
                    const previewUrl = videoPreviewUrls[index];

                    return (
                      <div key={index} className="relative">
                        <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden hover:border-gray-400 transition-colors">
                          {currentVideo && previewUrl ? (
                            <div className="relative w-full h-full">
                              <video
                                src={previewUrl}
                                className="w-full h-full object-cover"
                                controls
                              />
                              <button
                                onClick={() => handleVideoDelete(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                title="Delete video"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-xs text-gray-500">Video {index + 1}</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleVideoUpload(index, file);
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NewPortofolioPage;