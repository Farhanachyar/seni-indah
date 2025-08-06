'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../../components/AuthProvider';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import TinyMCEEditor from '../../../../../components/TinyMCEEditor';
import CollapsibleSection from '../../../../../components/CollapsibleSection';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Info,
  Eye,
  FileText,
  Sparkles
} from 'lucide-react';

import { apiPost, apiFormData, ApiError } from '../../../../../utils/apiClient';

interface Category {
  id: number;
  name: string;
  slug: string;
  level: number;
  parent_id?: number;
  full_path?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const NewProductPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
      if (user?.email) {
        document.title = `New Product | ${user.email}`;
      } 
    }, [user?.email]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    benefits: '',
    price_regular: '',
    price_discount: '',
    category_id: '',
    sku: '',
    brand: '',
    weight: '',
    dimensions: '',
    meta_title: '',
    meta_description: '',
    stock_status: 'in_stock',
    is_featured: false
  });

  const [currentImages, setCurrentImages] = useState<(File | null)[]>(new Array(10).fill(null));
  const [imagePreviewUrls, setImagePreviewUrls] = useState<(string | null)[]>(new Array(10).fill(null));

  const [priceError, setPriceError] = useState('');

  const hasPrimaryImage = () => {
    return currentImages[0] !== null;
  };

  const validatePrices = (regular: string, discount: string) => {
    const regPrice = parseFloat(regular);
    const discPrice = parseFloat(discount);

    if (discount && !isNaN(regPrice) && !isNaN(discPrice)) {
      if (discPrice >= regPrice) {
        setPriceError('Harga diskon harus lebih kecil dari harga regular');
        return false;
      }
    }
    setPriceError('');
    return true;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

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
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Gagal memuat kategori');
      }
    } finally {
      setLoading(false);
    }
  };

  const flattenCategories = (categories: any[], level = 0): Category[] => {
    const flattened: Category[] = [];

    categories.forEach(cat => {
      flattened.push({
        id: cat.id,
        name: '—'.repeat(level) + ' ' + cat.name,
        slug: cat.slug,
        level: cat.level,
        parent_id: cat.parent_id,
        full_path: cat.full_path
      });

      if (cat.children && cat.children.length > 0) {
        flattened.push(...flattenCategories(cat.children, level + 1));
      }
    });

    return flattened;
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'price_regular' || field === 'price_discount') {
      const regular = field === 'price_regular' ? value : formData.price_regular;
      const discount = field === 'price_discount' ? value : formData.price_discount;
      validatePrices(regular, discount);
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

  const handleImageDelete = (index: number) => {

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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      if (!formData.title.trim()) {
        setError('Nama produk harus diisi');
        return;
      }

      if (!formData.price_regular) {
        setError('Harga regular harus diisi');
        return;
      }

      if (!formData.category_id) {
        setError('Kategori harus dipilih');
        return;
      }

      if (!validatePrices(formData.price_regular, formData.price_discount)) {
        setError('Perbaiki error harga sebelum menyimpan');
        return;
      }

      if (!hasPrimaryImage()) {
        setError('Gambar thumbnail (Gambar 1) wajib diisi');
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description);
      formDataToSend.append('benefits', formData.benefits);
      formDataToSend.append('price_regular', formData.price_regular);
      formDataToSend.append('price_discount', formData.price_discount);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('weight', formData.weight);
      formDataToSend.append('dimensions', formData.dimensions);
      formDataToSend.append('meta_title', formData.meta_title);
      formDataToSend.append('meta_description', formData.meta_description);
      formDataToSend.append('stock_status', formData.stock_status);
      formDataToSend.append('is_featured', formData.is_featured.toString());

      if (currentImages[0]) {
        formDataToSend.append('primary_image', currentImages[0]);
      }

      for (let i = 1; i < 10; i++) {
        if (currentImages[i]) {
          formDataToSend.append(`image_${i + 1}`, currentImages[i]!);
        }
      }

      const result = await apiFormData<ApiResponse<any>>(
        '/v1.0/admin/product/create',
        formDataToSend
      );

      if (result.success) {
        setSuccess('Produk berhasil dibuat');

        setTimeout(() => {
          router.push(`/dashboard/management/products/edit/${result.data.product.slug}`);
        }, 2000);
      } else {
        setError(result.data || 'Gagal membuat produk');
      }
    } catch (err) {
      console.error('Save error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Gagal menyimpan produk');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      benefits: '',
      price_regular: '',
      price_discount: '',
      category_id: '',
      sku: '',
      brand: '',
      weight: '',
      dimensions: '',
      meta_title: '',
      meta_description: '',
      stock_status: 'in_stock',
      is_featured: false
    });

    imagePreviewUrls.forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });

    setCurrentImages(new Array(10).fill(null));
    setImagePreviewUrls(new Array(10).fill(null));
    setPriceError('');
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    fetchCategories();

    return () => {
      imagePreviewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
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

  if (loading) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const canSave = formData.title.trim() && formData.price_regular && formData.category_id && hasPrimaryImage() && !priceError;

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
        <div className="max-w-5xl mx-auto px-4">
          {}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link
                href="/dashboard/management/products"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">Kembali ke Daftar Produk</span>
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
                    <p className="text-sm lg:text-base text-gray-600">Buat produk baru untuk ditambahkan ke katalog</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleClear}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving || !canSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Menyimpan...' : 'Simpan Produk'}</span>
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

          {priceError && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {priceError}
            </div>
          )}

          {}
          {!hasPrimaryImage() && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Gambar thumbnail (Gambar 1) wajib diisi sebelum produk dapat disimpan
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
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama produk"
                    required
                  />
                  {formData.title && (
                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <Info className="w-4 h-4 inline mr-1 text-blue-600" />
                      <span className="text-blue-700">
                        Slug: <strong>{generateSlug(formData.title)}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Regular *
                  </label>
                  <input
                    type="number"
                    value={formData.price_regular}
                    onChange={(e) => handleFormChange('price_regular', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Diskon
                  </label>
                  <input
                    type="number"
                    value={formData.price_discount}
                    onChange={(e) => handleFormChange('price_discount', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      priceError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleFormChange('category_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Stok
                  </label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => handleFormChange('stock_status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in_stock">Tersedia</option>
                    <option value="out_of_stock">Habis</option>
                    <option value="pre_order">Pre-order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleFormChange('sku', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SKU-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleFormChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Berat (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleFormChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensi
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => handleFormChange('dimensions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100x200x10 cm"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => handleFormChange('is_featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Produk Unggulan</span>
                  </label>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Gambar Produk *</h2>
                <p className="text-sm text-gray-600">Upload gambar produk (maksimal 20MB per gambar, format: JPG, PNG, WebP)</p>
              </div>

              <div className="space-y-4">
                {}
                <div className={`border rounded-lg p-3 ${hasPrimaryImage() ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {hasPrimaryImage() ? (
                    <>
                      <Check className="w-4 h-4 inline mr-2 text-green-600" />
                      <span className="text-sm text-green-700">
                        <strong>Gambar 1 (Thumbnail)</strong> sudah dipilih dan akan digunakan sebagai gambar utama produk
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 inline mr-2 text-red-600" />
                      <span className="text-sm text-red-700">
                        <strong>Gambar 1 (Thumbnail) wajib diisi!</strong> Pilih gambar untuk posisi 1 terlebih dahulu.
                      </span>
                    </>
                  )}
                </div>

                {}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }, (_, index) => {
                    const currentImage = currentImages[index];
                    const previewUrl = imagePreviewUrls[index];

                    return (
                      <div key={index} className="relative">
                        <div className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-all duration-200 ${
                          index === 0 && !currentImage ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {currentImage && previewUrl ? (
                            <div className="relative w-full h-full group">
                              <img
                                src={previewUrl}
                                alt={`Gambar ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {}
                              {index === 0 && (
                                <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                                  Thumbnail
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200">
                                <button
                                  onClick={() => handleImageDelete(index)}
                                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform scale-90 group-hover:scale-100"
                                  title={`Hapus gambar ${index + 1}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <label className="cursor-pointer flex flex-col items-center hover:text-gray-600 transition-colors">
                                <ImageIcon className={`w-6 h-6 mb-1 ${index === 0 ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`text-xs ${index === 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                  {index === 0 ? 'Wajib' : 'Upload'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(index, file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-1">
                          <span className={`text-xs ${index === 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            Gambar {index + 1}
                            {index === 0 && <span> (Thumbnail)</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">📸 Tips upload gambar:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• <strong>Gambar 1 wajib diisi</strong> sebagai thumbnail produk</li>
                    <li>• Gunakan gambar berkualitas tinggi (minimal 800x800px)</li>
                    <li>• Format yang disarankan: JPG untuk foto, PNG untuk gambar dengan transparansi</li>
                    <li>• Pastikan pencahayaan yang baik dan fokus yang tajam</li>
                    <li>• Tampilkan produk dari berbagai sudut (depan, samping, detail, dll)</li>
                  </ul>
                </div>
              </div>
            </div>

            {}
            <CollapsibleSection
              title="Deskripsi Produk"
              subtitle="Tulis deskripsi lengkap produk dengan format yang menarik. Gunakan heading, bullet points, dan styling untuk memudahkan pembacaan."
              icon={<FileText className="w-5 h-5 text-blue-600" />}
              defaultOpen={false}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-blue-50"
            >
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <TinyMCEEditor
                    id="description-editor"
                    value={formData.description}
                    onChange={(content) => handleFormChange('description', content)}
                    height={400}
                    placeholder="Tulis deskripsi lengkap produk... Gunakan toolbar untuk formatting text, menambah gambar, tabel, dan lainnya."
                  />
                </div>

                {formData.description && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formData.description.replace(/<[^>]*>/g, '').length} karakter</span>
                  </div>
                )}

                {!formData.description && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada deskripsi produk</p>
                  </div>
                )}
              </div>
            </CollapsibleSection>

            {}
            <CollapsibleSection
              title="Keunggulan & Manfaat"
              subtitle="Jelaskan keunggulan dan manfaat produk ini. Buat dalam bentuk list atau paragraf yang mudah dipahami."
              icon={<Sparkles className="w-5 h-5 text-green-600" />}
              defaultOpen={false}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-green-50"
            >
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <TinyMCEEditor
                    id="benefits-editor"
                    value={formData.benefits}
                    onChange={(content) => handleFormChange('benefits', content)}
                    height={300}
                    placeholder="Jelaskan keunggulan dan manfaat produk... Contoh: ✓ Tahan air ✓ Mudah dipasang ✓ Berkualitas tinggi"
                  />
                </div>

                {formData.benefits && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formData.benefits.replace(/<[^>]*>/g, '').length} karakter</span>
                  </div>
                )}

                {!formData.benefits && (
                  <div className="text-center py-8 text-gray-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada keunggulan & manfaat</p>
                  </div>
                )}

                {}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-green-800 mb-2">💡 Tips menulis keunggulan:</h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Gunakan bullet points (✓, •, ★) untuk memudahkan pembacaan</li>
                    <li>• Fokus pada manfaat untuk customer, bukan hanya fitur</li>
                    <li>• Sertakan keunggulan dibanding kompetitor</li>
                    <li>• Gunakan kata-kata yang meyakinkan seperti "tahan lama", "berkualitas"</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>

            {}
            <CollapsibleSection
              title="SEO & Meta Data"
              subtitle="Optimasi untuk mesin pencari dan media sosial"
              icon={<Eye className="w-5 h-5 text-indigo-600" />}
              defaultOpen={false}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-indigo-50"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => handleFormChange('meta_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Otomatis berdasarkan nama produk jika kosong"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className={`${formData.meta_title.length > 60 ? 'text-red-600' : formData.meta_title.length > 50 ? 'text-yellow-600' : 'text-gray-500'}`}>
                      {formData.meta_title.length}/60 karakter
                    </span>
                    <span className="text-gray-400">Rekomendasi: 50-60 karakter</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => handleFormChange('meta_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Otomatis berdasarkan deskripsi produk jika kosong"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className={`${formData.meta_description.length > 160 ? 'text-red-600' : formData.meta_description.length > 150 ? 'text-yellow-600' : 'text-gray-500'}`}>
                      {formData.meta_description.length}/160 karakter
                    </span>
                    <span className="text-gray-400">Rekomendasi: 150-160 karakter</span>
                  </div>
                </div>

                {}
                {(formData.meta_title || formData.title) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">🔍 Preview Google Search:</h4>
                    <div className="space-y-1">
                      <div className="text-lg text-blue-600 hover:underline cursor-pointer">
                        {formData.meta_title || `${formData.title} - Seni Indah Gypsum`}
                      </div>
                      <div className="text-sm text-green-700">
                        seniindah.co.id › produk › {generateSlug(formData.title)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.meta_description || (formData.description ? 
                          formData.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
                          `${formData.title} berkualitas tinggi dari Seni Indah Gypsum. Produk terpercaya dengan garansi kualitas terjamin.`
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">🎯 Tips SEO:</h4>
                  <ul className="text-xs text-indigo-700 space-y-1">
                    <li>• Gunakan kata kunci utama di awal meta title</li>
                    <li>• Meta description harus meyakinkan dan mengundang klik</li>
                    <li>• Hindari keyword stuffing (pengulangan kata kunci berlebihan)</li>
                    <li>• Pastikan setiap produk memiliki meta data yang unik</li>
                  </ul>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NewProductPage;