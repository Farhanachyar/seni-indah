'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  AlertCircle,
  ArrowLeft,
  Download,
  Eye,
  Info,
  CheckCircle,
  X,
  Loader2,
  Camera,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react';

import { apiPost, ApiError } from '../../../../utils/apiClient';

interface LogoData {
  url: string;
  created_at: string;
  updated_at: string;
}

interface LogoResponse {
  success: boolean;
  data?: LogoData;
  message?: string;
}

interface UploadResponse {
  success: boolean;
  data?: {
    message: string;
    url: string;
  };
  message?: string;
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  data?: string;
  message?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Ya',
  cancelText = 'Batal',
  confirmButtonColor = 'bg-blue-600 hover:bg-blue-700',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="text-gray-600 text-sm whitespace-pre-line mb-6">
            {message}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${confirmButtonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showTechnicalInfo, setShowTechnicalInfo] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
      if (user?.email) {
        document.title = `Logo Settings | ${user.email}`;
      } 
    }, [user?.email]);

  const customConfirm = (
    title: string, 
    message: string, 
    confirmText = 'Ya', 
    cancelText = 'Batal',
    confirmButtonColor = 'bg-blue-600 hover:bg-blue-700'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        confirmButtonColor,
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        }
      });
    });
  };

  const handleModalCancel = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    loadLogo();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipe file tidak didukung. Gunakan PNG, JPG, JPEG, atau WebP');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Ukuran file terlalu besar. Maksimal 10MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(url);
    setError('');
  };

  const getLogoUrl = (logoPath: string): string => {
    if (!logoPath) {
      console.log('⚠️ No logo path provided');
      return '';
    }

    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return `${logoPath}?v=${Date.now()}`;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787';
    const fullUrl = logoPath.startsWith('/') ? `${baseUrl}${logoPath}` : `${baseUrl}/${logoPath}`;
    const finalUrl = `${fullUrl}?v=${Date.now()}`;

    console.log('🔗 Building logo URL:', {
      originalPath: logoPath,
      baseUrl: baseUrl,
      finalUrl: finalUrl
    });

    return finalUrl;
  };

  const loadLogo = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Loading logo from API...');

      const result = await apiPost<LogoResponse>(
        '/v1.0/admin/logo/get',
        {}
      );

      console.log('✅ Logo API response received:', result);

      if (result.success && result.data) {
        console.log('📸 Logo data found:', result.data);
        setLogoData(result.data);
      } else {
        console.log('❌ No logo data in response');
        setLogoData(null);
      }
    } catch (error) {
      console.error('💥 Error loading logo:', error);

      if (error instanceof ApiError && error.status !== 404) {
        setError(`Gagal memuat logo: ${error.message}`);
      } else {
        setLogoData(null);
      }
    } finally {
      setLoading(false);
      console.log('🏁 Logo loading process completed');
    }
  };

  const refreshLogo = async () => {
    setRefreshing(true);
    await loadLogo();
    setRefreshing(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const uploadLogo = async () => {
    if (!previewFile) return;

    const isReplace = logoData !== null;
    const confirmMessage = isReplace 
      ? `Apakah Anda yakin ingin mengganti logo yang ada dengan "${previewFile.name}"?`
      : `Apakah Anda yakin ingin mengupload logo "${previewFile.name}"?`;

    const confirmed = await customConfirm(
      'Konfirmasi Upload',
      confirmMessage,
      'Ya, Upload',
      'Batal',
      'bg-green-600 hover:bg-green-700'
    );

    if (!confirmed) {
      return;
    }

    try {
      setUploading(true);
      setError('');
      setMessage('');

      console.log('🔄 Starting logo upload...', {
        fileName: previewFile.name,
        fileSize: previewFile.size,
        fileType: previewFile.type,
        isReplace
      });

      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Token autentikasi tidak ditemukan');
        return;
      }

      const formData = new FormData();
      formData.append('file', previewFile, previewFile.name);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787';
      const uploadUrl = `${apiBaseUrl}/v1.0/admin/logo/upload`;

      console.log('🌐 Upload URL:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      console.log('📡 Upload response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawResponse = await response.text();
      console.log('📡 Raw response:', rawResponse);

      let result: UploadResponse;

      try {
        const parsedResponse = JSON.parse(rawResponse);
        console.log('📡 Parsed response:', parsedResponse);

        if (parsedResponse.status && parsedResponse.detail) {
          console.log('🔐 Encrypted response detected');
          if (parsedResponse.status === 'SUCCESS') {
            result = {
              success: true,
              data: {
                message: isReplace ? 'Logo berhasil diganti' : 'Logo berhasil diupload',
                url: 'refreshing...'
              }
            };
          } else {
            result = {
              success: false,
              error: 'Upload gagal (encrypted response)'
            };
          }
        } else {
          result = parsedResponse;
        }
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error(`Invalid JSON response: ${rawResponse}`);
      }

      console.log('✅ Final processed result:', result);

      if (result.success) {
        console.log('🎉 Upload successful');

        setMessage(result.data?.message || (isReplace ? 'Logo berhasil diganti' : 'Logo berhasil diupload'));
        setPreviewFile(null);
        setPreviewUrl('');

        console.log('🔄 Reloading logo data after upload...');
        await loadLogo();

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setTimeout(() => setMessage(''), 5000);
      } else {
        console.log('❌ Upload failed:', result);
        setError(result.message || result.error || 'Gagal mengupload logo');
      }
    } catch (error) {
      console.error('💥 Upload error:', error);
      setError(`Gagal mengupload logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      console.log('🏁 Upload process completed');
    }
  };

  const deleteLogo = async () => {

    const firstConfirmed = await customConfirm(
      '⚠️  PERINGATAN',
      'Anda akan menghapus logo sistem!\n\nApakah Anda yakin ingin melanjutkan?',
      'Ya, Lanjutkan',
      'Batal',
      'bg-orange-600 hover:bg-orange-700'
    );

    if (!firstConfirmed) {
      return;
    }

    const secondConfirmed = await customConfirm(
      '🔴 KONFIRMASI AKHIR',
      'Logo akan dihapus secara permanen!\n\nSetelah dihapus, logo tidak dapat dikembalikan.\nWebsite akan tidak memiliki logo sampai Anda upload yang baru.\n\nApakah Anda BENAR-BENAR yakin ingin menghapus logo?',
      'Ya, Hapus Permanen',
      'Batal',
      'bg-red-600 hover:bg-red-700'
    );

    if (!secondConfirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      console.log('🗑️ Starting logo deletion...');

      const result = await apiPost<DeleteResponse>(
        '/v1.0/admin/logo/delete',
        {}
      );

      console.log('✅ Delete response:', result);

      if (result.success) {
        const message = typeof result.data === 'string' ? result.data : 'Logo berhasil dihapus';
        console.log('🎉 Delete successful:', message);

        setMessage(message);
        setLogoData(null);

        setTimeout(() => setMessage(''), 5000);
      } else {
        console.log('❌ Delete failed:', result);
        setError(result.message || 'Gagal menghapus logo');
      }
    } catch (error) {
      console.error('💥 Delete error:', error);

      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Gagal menghapus logo');
      }
    } finally {
      setDeleting(false);
      console.log('🏁 Delete process completed');
    }
  };

  const cancelPreview = () => {
    setPreviewFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const downloadLogo = async () => {
    if (!logoData) return;

    try {
      const logoUrl = getLogoUrl(logoData.url);
      console.log('🔽 Downloading logo from:', logoUrl);

      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.status}`);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const fileName = logoData.url.split('/').pop() || 'logo.webp';
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ Logo downloaded successfully');
    } catch (error) {
      console.error('💥 Download error:', error);
      setError('Gagal mendownload logo');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data logo...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        {}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          confirmButtonColor={confirmModal.confirmButtonColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={handleModalCancel}
        />

        {}
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">

          {}
          <div className="mb-4 sm:mb-6">
            {}
            <button
              onClick={() => router.push('/dashboard/pengaturan')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Kembali</span>
            </button>

            {}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Logo & Media</h1>
                  <p className="text-sm sm:text-base text-gray-600">Kelola logo sistem dan media visual</p>
                </div>
                <button
                  onClick={refreshLogo}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {}
          {message && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base">{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          )}

          {}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Logo Saat Ini</h2>
              {logoData && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Monitor className="w-3 h-3" />
                  <span className="hidden sm:inline">/</span>
                  <Smartphone className="w-3 h-3" />
                  <span className="hidden sm:inline">Responsive</span>
                </div>
              )}
            </div>

            {logoData ? (
              <div className="space-y-4">
                {}
                <div className="w-full max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 p-6 sm:p-8">
                    <div className="flex items-center justify-center min-h-[200px] sm:min-h-[240px]">
                      {logoData.url ? (
                        <img
                          src={getLogoUrl(logoData.url)}
                          alt="Logo Sistem"
                          className="max-w-full max-h-full object-contain transition-all duration-300 hover:scale-105"
                          style={{ maxHeight: '200px' }}
                          onError={(e) => {
                            console.error('Failed to load logo:', logoData.url);
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="text-gray-500 text-sm text-center p-4">Logo tidak dapat dimuat</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="text-gray-500 text-sm text-center p-4">
                          Tidak ada logo
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Dibuat:</span> {formatDate(logoData.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Diperbarui:</span> {formatDate(logoData.updated_at)}
                    </div>
                  </div>

                  {}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center">
                    <button
                      onClick={() => window.open(getLogoUrl(logoData.url), '_blank')}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Lihat Full Size</span>
                    </button>
                    <button
                      onClick={downloadLogo}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={deleteLogo}
                      disabled={deleting}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm transition-colors"
                    >
                      {deleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>{deleting ? 'Menghapus...' : 'Hapus'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada logo</h3>
                <p className="text-gray-500 text-sm sm:text-base">Upload logo untuk sistem Anda.</p>
              </div>
            )}
          </div>

          {}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              {previewFile ? 'Ganti Logo' : (logoData ? 'Ganti Logo' : 'Upload Logo')}
            </h2>

            {!previewFile ? (

              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300
                    ${isDragging 
                      ? 'border-green-500 bg-green-50 scale-105' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                      ${isDragging ? 'bg-green-200' : 'bg-gray-100'}
                    `}>
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                        {isDragging ? 'Lepaskan gambar di sini' : 'Drag & drop gambar atau klik untuk pilih'}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        PNG, JPG, JPEG, atau WebP (Maksimal 10MB)
                      </p>
                      <p className="text-xs text-gray-400">
                        Rekomendasi: WebP dengan aspect ratio 16:9 untuk hasil terbaik
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (

              <div className="space-y-6">
                {}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Preview Logo Baru</h3>
                    <button
                      onClick={cancelPreview}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                      title="Batalkan preview"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {}
                  <div className="flex items-center justify-center min-h-[200px] sm:min-h-[240px] bg-white rounded-lg border-2 border-dashed border-gray-300 mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview Logo"
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>

                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-gray-500 mb-1">Nama File</p>
                      <p className="font-medium text-gray-900 truncate" title={previewFile.name}>
                        {previewFile.name}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-gray-500 mb-1">Ukuran</p>
                      <p className="font-medium text-gray-900">
                        {formatFileSize(previewFile.size)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-gray-500 mb-1">Format</p>
                      <p className="font-medium text-gray-900 uppercase">
                        {previewFile.type.split('/')[1]}
                      </p>
                    </div>
                  </div>
                </div>

                {}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={uploadLogo}
                    disabled={uploading}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Mengupload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>{logoData ? 'Ganti Logo' : 'Upload Logo'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelPreview}
                    disabled={uploading}
                    className="flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors font-medium"
                  >
                    <X className="w-5 h-5" />
                    <span>Batal</span>
                  </button>
                </div>

                {}
                {uploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">Sedang mengupload logo...</p>
                        <p className="text-xs text-blue-600">Mohon tunggu, proses sedang berlangsung</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                  Panduan Upload Logo
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p><strong>Format:</strong> PNG, JPG, JPEG, WebP</p>
                    <p><strong>Ukuran maksimal:</strong> 10MB</p>
                    <p><strong>Rekomendasi:</strong> WebP format</p>
                    <p><strong>Aspect ratio:</strong> 16:9 optimal</p>
                  </div>
                  <p className="mt-3"><strong>Resolusi minimum:</strong> 800x450 pixel untuk kualitas terbaik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LogoPage;