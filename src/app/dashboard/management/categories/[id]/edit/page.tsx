'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../../../components/AuthProvider';
import ProtectedRoute from '../../../../../../components/ProtectedRoute';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  FolderTree, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Save,
  Upload,
  X,
  CheckCircle,
  Edit3
} from 'lucide-react';

import { apiPost, apiFormData, ApiError } from '../../../../../../utils/apiClient';

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
  created_by?: string;
  updated_by?: string;
  children: Category[];
  product_count?: number;
  children_count?: number;
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

const EditCategoryPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const fetchData = async () => {
    try {
      setLoading(true);

      const categoriesResult = await apiPost<ApiResponse<CategoriesResponse | string>>(
        '/v1.0/admin/categories',
        {}
      );

      if (categoriesResult.success) {
        const data = categoriesResult.data as CategoriesResponse;
        setCategories(data.categories || []);

        const findCategory = (cats: Category[]): Category | null => {
          for (const cat of cats) {
            if (cat.id.toString() === categoryId) {
              return cat;
            }
            if (cat.children.length > 0) {
              const found = findCategory(cat.children);
              if (found) return found;
            }
          }
          return null;
        };

        const found = findCategory(data.categories || []);
        if (found) {
          setCurrentCategory(found);
          setFormData({
            id: found.id,
            name: found.name,
            description: found.description || '',
            parent_id: found.parent_id?.toString() || '',
            sort_order: found.sort_order.toString(),
            meta_title: found.meta_title || '',
            meta_description: found.meta_description || '',
            image: null,
            remove_image: false
          });

          if (found.image) {
            setImagePreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${found.image}`);
          }
        } else {
          setError('Kategori tidak ditemukan');
        }
      } else {
        const errorMessage = typeof categoriesResult.data === 'string' ? categoriesResult.data : 'Failed to load categories';
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !currentCategory) return;

    try {
      setSubmitting(true);
      setError('');

      const isBecomingMainCategory = !formData.parent_id || formData.parent_id === '';
      const wasMainCategory = !currentCategory.parent_id;
      const isBecomingSubCategory = (formData.parent_id && formData.parent_id !== '') && wasMainCategory;
      const currentHasImage = currentCategory.image && !formData.remove_image;
      const hasNewImage = formData.image;

      if (isBecomingMainCategory && !currentHasImage && !hasNewImage) {
        setError('Kategori utama wajib memiliki gambar. Silakan pilih gambar terlebih dahulu.');
        setSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('id', currentCategory.id.toString());
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('parent_id', formData.parent_id);
      formDataToSend.append('sort_order', formData.sort_order);
      formDataToSend.append('meta_title', formData.meta_title.trim());
      formDataToSend.append('meta_description', formData.meta_description.trim());

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (isBecomingSubCategory || formData.remove_image) {
        formDataToSend.append('remove_image', 'true');
      }

      const result = await apiFormData<ApiResponse<CategoryResponse | string>>(
        `/v1.0/admin/category/update`,
        formDataToSend
      );

      if (result.success) {
        setSuccess(true);

        setTimeout(() => {
          router.push('/dashboard/management/categories');
        }, 2000);
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

  useEffect(() => {
    if (user?.email, currentCategory?.name) {
      document.title = `${currentCategory?.name} | ${user?.email}`;
    } 
  }, [user?.email, currentCategory?.name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.');
        e.target.value = '';
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 20MB.');
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

  const getParentOptions = (categories: Category[], currentId: number): Category[] => {
    const options: Category[] = [];

    const getDescendantIds = (category: Category): Set<number> => {
      const ids = new Set<number>();

      const collectIds = (cat: Category) => {
        ids.add(cat.id);
        cat.children.forEach(child => collectIds(child));
      };

      collectIds(category);
      return ids;
    };

    const findCurrentCategory = (cats: Category[]): Category | null => {
      for (const cat of cats) {
        if (cat.id === currentId) return cat;
        if (cat.children.length > 0) {
          const found = findCurrentCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    const currentCat = findCurrentCategory(categories);
    const excludeIds = currentCat ? getDescendantIds(currentCat) : new Set([currentId]);

    const addOptions = (cats: Category[], level = 0) => {
      cats.forEach(cat => {
        if (!excludeIds.has(cat.id)) {
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
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data kategori...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (success) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Kategori Berhasil Diperbarui!</h2>
            <p className="text-gray-600 mb-4">Anda akan dialihkan ke halaman utama dalam beberapa detik...</p>
            <Link
              href="/dashboard/management/categories"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Kembali ke Daftar Kategori
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!currentCategory) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-4">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Kategori Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Kategori yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <Link
              href="/dashboard/management/categories"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kembali ke Daftar Kategori
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                href="/dashboard/management/categories"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Kembali ke Daftar Kategori</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Kategori</h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Mengedit: <span className="font-medium">{currentCategory.name}</span>
                  </p>
                </div>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Informasi Kategori Saat Ini:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Level:</span> 
                <span className="ml-2 font-medium">{currentCategory.level === 0 ? 'Utama' : `Sub Level ${currentCategory.level}`}</span>
              </div>
              <div>
                <span className="text-blue-700">Slug:</span> 
                <span className="ml-2 font-medium">{currentCategory.slug}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-blue-700">Path:</span> 
                <span className="ml-2 font-medium">{currentCategory.full_path}</span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Perbarui Informasi Kategori</h2>
              <p className="text-sm text-gray-600 mt-1">Ubah informasi kategori sesuai kebutuhan</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="space-y-6">
                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kategori *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">-- Kategori Utama --</option>
                    {getParentOptions(categories, currentCategory.id).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {'—'.repeat(cat.level)} {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Kosongkan jika ini adalah kategori utama. Tidak dapat memilih kategori ini sendiri atau anak kategorinya.
                  </p>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Deskripsi kategori (opsional)"
                  />
                </div>

                {}
                {(!formData.parent_id || formData.parent_id === '') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Kategori *
                      <span className="text-red-500 text-xs ml-1">
                        (Wajib untuk kategori utama)
                      </span>
                    </label>
                    <div className="space-y-4">
                      {}
                      {(!currentCategory.parent_id ? false : true) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-yellow-800 font-medium">Perhatian!</p>
                              <p className="text-yellow-700">
                                Anda mengubah kategori ini menjadi kategori utama. 
                                Gambar kategori wajib diisi untuk kategori utama.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

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
                            title="Hapus gambar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {}
                      {(!imagePreview && (!formData.parent_id || formData.parent_id === '')) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-red-800 font-medium">Gambar Diperlukan</p>
                              <p className="text-red-700">
                                Kategori utama harus memiliki gambar. Silakan pilih gambar di bawah ini.
                              </p>
                            </div>
                          </div>
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
                          {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG, WebP. Maksimal 20MB. Wajib untuk kategori utama.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {}
                {(formData.parent_id && formData.parent_id !== '') && currentCategory.image && !currentCategory.parent_id && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm flex-1">
                        <p className="text-orange-800 font-medium mb-2">Perhatian: Gambar Kategori Akan Dihapus</p>
                        <p className="text-orange-700 mb-3">
                          Kategori ini saat ini memiliki gambar karena merupakan kategori utama. 
                          Ketika diubah menjadi sub kategori, gambar akan otomatis dihapus dari sistem 
                          karena sub kategori tidak memerlukan gambar.
                        </p>

                        {}
                        <div className="mb-3">
                          <p className="text-orange-800 font-medium mb-2">Gambar yang akan dihapus:</p>
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${currentCategory.image}`}
                            alt={currentCategory.name}
                            className="w-24 h-24 object-cover rounded-lg border border-orange-300"
                          />
                        </div>

                        <div className="bg-orange-100 border border-orange-300 rounded p-3">
                          <p className="text-orange-800 text-xs">
                            <strong>Info:</strong> Sub kategori akan menggunakan gambar dari kategori utama (parent). 
                            Jika Anda ingin mempertahankan gambar ini, pertimbangkan untuk membuat kategori utama baru 
                            dan memindahkan kategori ini sebagai sub kategorinya.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {}
                {(formData.parent_id && formData.parent_id !== '') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="text-sm">
                        <p className="text-blue-800 font-medium">Info Kategori Sub</p>
                        <p className="text-blue-700">
                          Kategori sub tidak memerlukan gambar. Gambar akan menggunakan gambar dari kategori utama.
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Angka yang lebih kecil akan ditampilkan lebih awal
                  </p>
                </div>

                {}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SEO (Opsional)</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.meta_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Meta description untuk SEO"
                      />
                    </div>
                  </div>
                </div>

                {}
                <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                  <Link
                    href="/dashboard/management/categories"
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || !formData.name.trim() || ((!formData.parent_id || formData.parent_id === '') && !imagePreview)}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{submitting ? 'Menyimpan...' : 'Perbarui Kategori'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditCategoryPage;