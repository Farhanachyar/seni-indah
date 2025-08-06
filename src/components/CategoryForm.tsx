'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  X,
  Upload,
  Loader2,
  AlertCircle,
  FolderTree
} from 'lucide-react';

import { apiPost, apiFormData, ApiError } from '../utils/apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CategoriesResponse {
  categories: Category[];
  stats: any;
  total_count: number;
}

interface CategoryResponse {
  message: string;
  category: {
    id: number;
    name: string;
    slug: string;
    level: number;
    full_path: string;
    image?: string;
  };
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
  children: Category[];
}

interface CategoryFormData {
  id?: number;
  name: string;
  description: string;
  parent_id: string;
  sort_order: string;
  meta_title: string;
  meta_description: string;
  image?: File | null;
  remove_image: boolean;
}

interface CategoryFormProps {
  mode: 'add' | 'edit';
  categoryId?: number;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ mode, categoryId }) => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parent_id: '',
    sort_order: '0',
    meta_title: '',
    meta_description: '',
    image: null,
    remove_image: false
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const result = await apiPost<ApiResponse<CategoriesResponse | string>>(
        '/v1.0/admin/categories',
        {}
      );

      if (result.success) {
        const data = result.data as CategoriesResponse;
        setCategories(data.categories || []);
      } else {
        throw new Error(typeof result.data === 'string' ? result.data : 'Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    }
  };

  const fetchCategoryData = async (id: number) => {
    try {

      const category = findCategoryById(categories, id);
      if (category) {
        setFormData({
          id: category.id,
          name: category.name,
          description: category.description || '',
          parent_id: category.parent_id?.toString() || '',
          sort_order: category.sort_order.toString(),
          meta_title: category.meta_title || '',
          meta_description: category.meta_description || '',
          image: null,
          remove_image: false
        });

        if (category.image) {
          setImagePreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${category.image}`);
        }
      } else {
        setError('Kategori tidak ditemukan');
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Gagal memuat data kategori');
    }
  };

  const findCategoryById = (categories: Category[], id: number): Category | null => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      if (cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();

      if (mode === 'edit' && categoryId) {
        await fetchCategoryData(categoryId);
      }

      setLoading(false);
    };

    loadData();
  }, [mode, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('parent_id', formData.parent_id);
      formDataToSend.append('sort_order', formData.sort_order);
      formDataToSend.append('meta_title', formData.meta_title.trim());
      formDataToSend.append('meta_description', formData.meta_description.trim());

      if (mode === 'edit' && formData.id) {
        formDataToSend.append('id', formData.id.toString());
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (formData.remove_image) {
        formDataToSend.append('remove_image', 'true');
      }

      const endpoint = mode === 'edit' ? 'update' : 'create';

      const result = await apiFormData<ApiResponse<CategoryResponse | string>>(
        `/v1.0/admin/category/${endpoint}`,
        formDataToSend
      );

      if (result.success) {
        setSuccess(mode === 'edit' ? 'Kategori berhasil diperbarui!' : 'Kategori berhasil dibuat!');

        setTimeout(() => {
          router.push('/dashboard/management/categories');
        }, 1500);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Operation failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Operation failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 5MB.');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({ ...prev, image: file, remove_image: false }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null, remove_image: true }));
    setImagePreview(null);

    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getParentOptions = (categories: Category[], currentId?: number): Category[] => {
    const options: Category[] = [];

    const addOptions = (cats: Category[], level = 0) => {
      cats.forEach(cat => {
        if (cat.id !== currentId) {
          options.push({ ...cat, level });
          if (cat.children.length > 0) {
            addOptions(cat.children, level + 1);
          }
        }
      });
    };

    addOptions(categories);
    return options;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/dashboard/management" className="hover:text-gray-900">
              Management
            </Link>
            <span>/</span>
            <Link href="/dashboard/management/categories" className="hover:text-gray-900">
              Kategori
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {mode === 'edit' ? 'Edit' : 'Tambah Baru'}
            </span>
          </nav>

          <div className="flex items-center">
            <Link
              href="/dashboard/management/categories"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-sm">Kembali</span>
            </Link>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {mode === 'edit' ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {mode === 'edit' ? 'Perbarui informasi kategori' : 'Buat kategori produk baru'}
              </p>
            </div>
          </div>
        </div>

        {}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <div className="w-5 h-5 mr-2 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm sm:text-base">{success}</span>
          </div>
        )}

        {}
        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kategori *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan nama kategori"
                required
              />
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Parent
              </label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">-- Kategori Utama --</option>
                {getParentOptions(categories, formData.id).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {'—'.repeat(cat.level)} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Deskripsi kategori (opsional)"
              />
            </div>

            {}
            {(!formData.parent_id || formData.parent_id === '') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Kategori
                </label>
                <div className="space-y-4">
                  {}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {}
                  <div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih Gambar
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WebP. Maksimal 5MB. Hanya untuk kategori utama.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan Sorting
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            {}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">SEO (Opsional)</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Meta title untuk SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Meta description untuk SEO"
                />
              </div>
            </div>

            {}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard/management/categories"
                className="w-full sm:w-auto px-4 py-2 text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{submitting ? 'Menyimpan...' : (mode === 'edit' ? 'Update' : 'Simpan')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;