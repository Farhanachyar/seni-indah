'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../../../components/AuthProvider';
import ProtectedRoute from '../../../../../../components/ProtectedRoute';
import TinyMCEEditor from '../../../../../../components/TinyMCEEditor';
import CollapsibleSection from '../../../../../../components/CollapsibleSection';
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
  Edit3,
  Check,
  AlertCircle,
  Info,
  Eye,
  RotateCcw,
  FileText,
  Sparkles
} from 'lucide-react';

import { apiPost, apiFormData, ApiError } from '../../../../../../utils/apiClient';

interface Product {
  id: number;
  title: string;
  slug: string;
  description?: string;
  benefits?: string;
  price_regular: number;
  price_discount?: number;
  category_id: number;
  primary_image_url?: string;
  sku?: string;
  brand?: string;
  weight?: number;
  dimensions?: string;
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  stock_status: string;
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  image_url_5?: string;
  image_url_6?: string;
  image_url_7?: string;
  image_url_8?: string;
  image_url_9?: string;
  image_url_10?: string;
}

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

interface ImageChange {
  action: 'upload' | 'delete';
  index: number;
  file?: File;
  preview?: string;
}

const SlugConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (slug: string) => void;
  title: string;
  message: string;
  requiredSlug: string;
  type?: 'warning' | 'danger';
}> = ({ isOpen, onClose, onConfirm, title, message, requiredSlug, type = 'warning' }) => {
  const [inputSlug, setInputSlug] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(inputSlug === requiredSlug);
  }, [inputSlug, requiredSlug]);

  useEffect(() => {
    if (isOpen) {
      setInputSlug('');
      setIsValid(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(inputSlug);
      setInputSlug('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className={`w-6 h-6 mr-3 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-4">{message}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ketik slug produk untuk konfirmasi:
          </label>
          <div className="space-y-2">
            <div className="p-2 bg-gray-100 rounded border text-sm font-mono text-gray-800">
              {requiredSlug}
            </div>
            <input
              type="text"
              value={inputSlug}
              onChange={(e) => setInputSlug(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                inputSlug && !isValid 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Masukkan slug di atas"
              autoFocus
            />
            {inputSlug && !isValid && (
              <p className="text-sm text-red-600">Slug tidak sesuai</p>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`flex-1 px-4 py-2 rounded-lg font-medium ${
              isValid
                ? type === 'danger' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Konfirmasi
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

const PrimaryImageDeleteConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Hapus Primary Image?</h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Anda akan menghapus <strong>primary image</strong> (gambar utama) produk ini.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              <strong>Peringatan:</strong> Primary image wajib ada untuk setiap produk. 
              Jika Anda menghapus gambar ini, Anda harus mengupload gambar baru di posisi 1 
              sebelum dapat menyimpan produk.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            Ya, Hapus
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductEditPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  useEffect(() => {
      if (user?.email, formData.title) {
        document.title = `${formData.title} | ${user?.email}`;
      } 
    }, [user?.email, formData.title]);

  const [originalImages, setOriginalImages] = useState<(string | null)[]>(new Array(10).fill(null));
  const [currentImages, setCurrentImages] = useState<(string | null)[]>(new Array(10).fill(null));
  const [imageChanges, setImageChanges] = useState<ImageChange[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteProductConfirm, setShowDeleteProductConfirm] = useState(false);
  const [showDeletePrimaryConfirm, setShowDeletePrimaryConfirm] = useState(false);

  const [priceError, setPriceError] = useState('');

  const hasPrimaryImage = () => {
    return currentImages[0] !== null;
  };

  const isDeletePrimaryImage = (index: number) => {
    return index === 0 && currentImages[0] !== null;
  };

  const checkUnsavedChanges = () => {
    if (!product) return false;

    const formChanged = (
      formData.title !== product.title ||
      formData.description !== (product.description || '') ||
      formData.benefits !== (product.benefits || '') ||
      formData.price_regular !== product.price_regular.toString() ||
      formData.price_discount !== (product.price_discount?.toString() || '') ||
      formData.category_id !== product.category_id.toString() ||
      formData.sku !== (product.sku || '') ||
      formData.brand !== (product.brand || '') ||
      formData.weight !== (product.weight?.toString() || '') ||
      formData.dimensions !== (product.dimensions || '') ||
      formData.meta_title !== (product.meta_title || '') ||
      formData.meta_description !== (product.meta_description || '') ||
      formData.stock_status !== product.stock_status ||
      formData.is_featured !== product.is_featured
    );

    const imageChanged = imageChanges.length > 0;

    return formChanged || imageChanged;
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

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const slugResult = await apiPost<ApiResponse<Product>>(
        '/v1.0/admin/product/get',
        { slug: params.slug }
      );

      if (!slugResult.success) {
        throw new Error(typeof slugResult.data === 'string' ? slugResult.data : 'Failed to load product');
      }

      const result = await apiPost<ApiResponse<{ product: Product, categories: Category[] }>>(
        '/v1.0/admin/product/get-by-id',
        { id: slugResult.data.id }
      );

      if (result.success) {
        const productData = result.data.product;
        setProduct(productData);
        setCategories(result.data.categories);

        setFormData({
          title: productData.title || '',
          description: productData.description || '',
          benefits: productData.benefits || '',
          price_regular: productData.price_regular?.toString() || '',
          price_discount: productData.price_discount?.toString() || '',
          category_id: productData.category_id?.toString() || '',
          sku: productData.sku || '',
          brand: productData.brand || '',
          weight: productData.weight?.toString() || '',
          dimensions: productData.dimensions || '',
          meta_title: productData.meta_title || '',
          meta_description: productData.meta_description || '',
          stock_status: productData.stock_status || 'in_stock',
          is_featured: productData.is_featured || false
        });

        const existingImgs: (string | null)[] = [];
        for (let i = 1; i <= 10; i++) {
          const imageKey = `image_url_${i}` as keyof Product;
          existingImgs.push(productData[imageKey] as string || null);
        }
        setOriginalImages([...existingImgs]);
        setCurrentImages([...existingImgs]);

        setImageChanges([]);
        setHasUnsavedChanges(false);

      } else {
        throw new Error(typeof result.data === 'string' ? result.data : 'Failed to load product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'price_regular' || field === 'price_discount') {
      const regular = field === 'price_regular' ? value : formData.price_regular;
      const discount = field === 'price_discount' ? value : formData.price_discount;
      validatePrices(regular, discount);
    }

    setTimeout(() => {
      setHasUnsavedChanges(checkUnsavedChanges());
    }, 0);
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;

      setCurrentImages(prev => {
        const newImages = [...prev];
        newImages[index] = preview;
        return newImages;
      });

      setImageChanges(prev => {
        const filtered = prev.filter(change => change.index !== index);
        return [...filtered, {
          action: 'upload',
          index,
          file,
          preview
        }];
      });

      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const performImageDelete = (index: number) => {

    setCurrentImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });

    setImageChanges(prev => {
      const filtered = prev.filter(change => change.index !== index);

      if (originalImages[index]) {
        return [...filtered, {
          action: 'delete',
          index
        }];
      }

      return filtered;
    });

    setHasUnsavedChanges(true);
  };

  const handleImageDelete = (index: number) => {

    if (isDeletePrimaryImage(index)) {
      setShowDeletePrimaryConfirm(true);
      return;
    }

    performImageDelete(index);
  };

  const resetImageChanges = () => {
    setCurrentImages([...originalImages]);
    setImageChanges([]);
    setHasUnsavedChanges(checkUnsavedChanges());
  };

  const handleSave = async (confirmSlug: string) => {
    try {
      setSaving(true);

      if (!validatePrices(formData.price_regular, formData.price_discount)) {
        setError('Perbaiki error harga sebelum menyimpan');
        setSaving(false);
        return;
      }

      if (!hasPrimaryImage()) {
        setError('Primary image (Gambar 1) wajib diisi sebelum menyimpan produk');
        setSaving(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('id', product!.id.toString());
      formDataToSend.append('title', formData.title);
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
      formDataToSend.append('confirm_slug', confirmSlug);

      console.log('🖼️ Processing image changes:', imageChanges);

      imageChanges.forEach(change => {
        if (change.action === 'delete') {
          formDataToSend.append(`delete_image_${change.index + 1}`, 'true');
          console.log(`🗑️ Marked image ${change.index + 1} for deletion`);
        }
      });

      imageChanges.forEach(change => {
        if (change.action === 'upload' && change.file) {
          formDataToSend.append(`image_${change.index + 1}`, change.file);
          console.log(`📸 Added image ${change.index + 1} for upload:`, change.file.name);
        }
      });

      const endpoint = imageChanges.length > 0 
        ? '/v1.0/admin/product/update-batch' 
        : '/v1.0/admin/product/update';

      console.log(`🚀 Using endpoint: ${endpoint}`);

      const result = await apiFormData<ApiResponse<any>>(
        endpoint,
        formDataToSend
      );

      if (result.success) {
        setSuccess('Produk berhasil diupdate');
        setError('');
        setShowSaveConfirm(false);

        setImageChanges([]);
        setHasUnsavedChanges(false);

        if (result.data.summary) {
          console.log('✅ Update summary:', result.data.summary);
          if (result.data.summary.images_uploaded > 0) {
            setSuccess(`Produk berhasil diupdate dengan ${result.data.summary.images_uploaded} gambar baru`);
          }
          if (result.data.summary.errors && result.data.summary.errors.length > 0) {
            console.warn('⚠️ Some errors occurred:', result.data.summary.errors);
          }
        }

        await fetchProduct();

      } else {

        if (result.data && typeof result.data === 'object' && result.data.confirmation_required) {
          setError(result.data.message || 'Konfirmasi diperlukan');
        } else {
          setError(result.data || 'Update failed');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Save failed');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (confirmSlug: string) => {
    try {

      const result = await apiPost<ApiResponse<any>>(
        '/v1.0/admin/product/delete',
        { 
          id: product!.id,
          confirm_slug: confirmSlug
        }
      );

      if (result.success) {
        setSuccess('Produk berhasil dihapus');
        setTimeout(() => {
          router.push('/dashboard/management/products');
        }, 1500);
      } else {
        setError(result.data || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete product error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Delete failed');
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

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

  useEffect(() => {
    setHasUnsavedChanges(checkUnsavedChanges());
  }, [formData, imageChanges, product]);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data produk...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Produk yang Anda cari tidak ditemukan atau sudah dihapus.</p>
            <Link
              href="/dashboard/management/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Produk
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                    <Edit3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Produk</h1>
                    <p className="text-sm lg:text-base text-gray-600">{product.title}</p>
                    {hasUnsavedChanges && (
                      <span className="inline-flex items-center text-xs text-orange-600 mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Ada perubahan yang belum disimpan
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {hasUnsavedChanges && (
                    <button
                      onClick={() => {
                        setFormData({
                          title: product.title || '',
                          description: product.description || '',
                          benefits: product.benefits || '',
                          price_regular: product.price_regular?.toString() || '',
                          price_discount: product.price_discount?.toString() || '',
                          category_id: product.category_id?.toString() || '',
                          sku: product.sku || '',
                          brand: product.brand || '',
                          weight: product.weight?.toString() || '',
                          dimensions: product.dimensions || '',
                          meta_title: product.meta_title || '',
                          meta_description: product.meta_description || '',
                          stock_status: product.stock_status || 'in_stock',
                          is_featured: product.is_featured || false
                        });
                        resetImageChanges();
                        setPriceError('');
                      }}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowSaveConfirm(true)}
                    disabled={saving || !hasUnsavedChanges || !!priceError || !hasPrimaryImage()}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteProductConfirm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
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
              Primary image (Gambar 1) wajib diisi sebelum produk dapat disimpan
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
                  {formData.title !== product.title && (
                    <div className="mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <Info className="w-4 h-4 inline mr-1 text-blue-600" />
                      <span className="text-blue-700">
                        Slug baru: <strong>{formData.title ? formData.title
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-+|-+$/g, '') : ''}</strong>
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
                  {priceError && (
                    <p className="mt-1 text-sm text-red-600">{priceError}</p>
                  )}
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
                    <span className="text-blue-600">
                      {formData.description !== (product?.description || '') ? '• Diubah' : '• Tersimpan'}
                    </span>
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
              title="Gambar Produk"
              subtitle="Upload gambar produk (maksimal 20MB per gambar, format: JPG, PNG, WebP)"
              icon={<ImageIcon className="w-5 h-5 text-purple-600" />}
              defaultOpen={false}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-purple-50"
            >
              <div className="space-y-4">
                {}
                {imageChanges.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-sm text-orange-700">
                          {imageChanges.length} perubahan gambar akan disimpan
                        </span>
                      </div>
                      <button
                        onClick={resetImageChanges}
                        className="text-sm text-orange-600 hover:text-orange-800 underline"
                      >
                        Reset semua perubahan
                      </button>
                    </div>
                  </div>
                )}

                {}
                <div className={`border rounded-lg p-3 ${hasPrimaryImage() ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                  {hasPrimaryImage() ? (
                    <>
                      <Info className="w-4 h-4 inline mr-2 text-blue-600" />
                      <span className="text-sm text-blue-700">
                        <strong>Gambar 1</strong> akan digunakan sebagai thumbnail utama produk
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 inline mr-2 text-red-600" />
                      <span className="text-sm text-red-700">
                        <strong>Primary image wajib diisi!</strong> Upload gambar di posisi 1 terlebih dahulu.
                      </span>
                    </>
                  )}
                </div>

                {}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }, (_, index) => {
                    const currentImage = currentImages[index];
                    const hasChanges = imageChanges.some(change => change.index === index);

                    return (
                      <div key={index} className="relative">
                        <div className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-all duration-200 ${
                          hasChanges ? 'border-orange-300 bg-orange-50 shadow-md' : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {currentImage ? (
                            <div className="relative w-full h-full group">
                              <img
                                src={currentImage.startsWith('data:') 
                                  ? currentImage 
                                  : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${currentImage}`
                                }
                                alt={`Gambar ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {}
                              {index === 0 && (
                                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                                  Primary
                                </div>
                              )}
                              {}
                              {hasChanges && (
                                <div className="absolute top-1 right-1 bg-orange-600 text-white text-xs px-2 py-1 rounded shadow-sm animate-pulse">
                                  {imageChanges.find(c => c.index === index)?.action === 'upload' ? 'New' : 'Del'}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200">
                                <button
                                  onClick={() => handleImageDelete(index)}
                                  className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform scale-90 group-hover:scale-100"
                                  title={index === 0 ? "Hapus primary image (perlu konfirmasi)" : `Hapus gambar ${index + 1}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <label className="cursor-pointer flex flex-col items-center hover:text-gray-600 transition-colors">
                                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Upload</span>
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
                          <span className="text-xs text-gray-500">
                            Gambar {index + 1}
                            {index === 0 && <span className="text-blue-600 font-medium"> (Thumbnail)</span>}
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
                    <li>• Gunakan gambar berkualitas tinggi (minimal 800x800px)</li>
                    <li>• Format yang disarankan: JPG untuk foto, PNG untuk gambar dengan transparansi</li>
                    <li>• Pastikan pencahayaan yang baik dan fokus yang tajam</li>
                    <li>• Tampilkan produk dari berbagai sudut (depan, samping, detail, dll)</li>
                  </ul>
                </div>
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
                    <span className="text-green-600">
                      {formData.benefits !== (product?.benefits || '') ? '• Diubah' : '• Tersimpan'}
                    </span>
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
                        seniindah.co.id › produk › {formData.title.toLowerCase().replace(/\s+/g, '-')}
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

          {}
          <SlugConfirmationModal
            isOpen={showSaveConfirm}
            onClose={() => setShowSaveConfirm(false)}
            onConfirm={handleSave}
            title="Konfirmasi Simpan Perubahan"
            message="Masukkan slug produk untuk mengkonfirmasi perubahan."
            requiredSlug={product.slug}
            type="warning"
          />

          <SlugConfirmationModal
            isOpen={showDeleteProductConfirm}
            onClose={() => setShowDeleteProductConfirm(false)}
            onConfirm={handleDeleteProduct}
            title="Konfirmasi Hapus Produk"
            message="Masukkan slug produk untuk mengkonfirmasi penghapusan produk secara permanen."
            requiredSlug={product.slug}
            type="danger"
          />

          <PrimaryImageDeleteConfirmModal
            isOpen={showDeletePrimaryConfirm}
            onClose={() => setShowDeletePrimaryConfirm(false)}
            onConfirm={() => {
              performImageDelete(0);
              setShowDeletePrimaryConfirm(false);
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProductEditPage;