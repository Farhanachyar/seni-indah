'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../../../components/AuthProvider';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import TinyMCEEditor from '../../../../../components/TinyMCEEditor';
import CollapsibleSection from '../../../../../components/CollapsibleSection';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Image as ImageIcon, 
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertTriangle,
  Loader2,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Info,
  FileText,
  Video,
  Calendar,
  MapPin,
  Folder,
  Grid,
  Grid3X3,
  Star
} from 'lucide-react';

import { apiPost, apiFormData, ApiError } from '../../../../../utils/apiClient';

interface Gallery {
  id: number;
  post_title: string;
  slug: string;
  category: string;
  location?: string;
  deskripsi?: string;
  tanggal_unggahan?: string;
  style_view: string;
  thumbnail?: string;
  created_by?: string;
  create_at?: string;
  update_at?: string;

  image_url1?: string; image_url2?: string; image_url3?: string; image_url4?: string; image_url5?: string;
  image_url6?: string; image_url7?: string; image_url8?: string; image_url9?: string; image_url10?: string;
  image_url11?: string; image_url12?: string; image_url13?: string; image_url14?: string; image_url15?: string;
  image_url16?: string; image_url17?: string; image_url18?: string; image_url19?: string; image_url20?: string;
  image_url21?: string; image_url22?: string; image_url23?: string; image_url24?: string; image_url25?: string;
  image_url26?: string; image_url27?: string; image_url28?: string; image_url29?: string; image_url30?: string;

  video_url1?: string; video_url2?: string; video_url3?: string; video_url4?: string; video_url5?: string;
  video_url6?: string; video_url7?: string; video_url8?: string; video_url9?: string; video_url10?: string;
  video_url11?: string; video_url12?: string; video_url13?: string; video_url14?: string; video_url15?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface MediaChange {
  action: 'upload' | 'delete';
  index: number;
  type: 'image' | 'video';
  file?: File;
  preview?: string;
}

const EditPortofolioPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    post_title: '',
    category: '',
    location: '',
    deskripsi: '',
    tanggal_unggahan: '',
    style_view: '1-Grid'
  });

  const [currentImages, setCurrentImages] = useState<(string | null)[]>(new Array(30).fill(null));
  const [currentVideos, setCurrentVideos] = useState<(string | null)[]>(new Array(15).fill(null));
  const [mediaChanges, setMediaChanges] = useState<MediaChange[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(-1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const result = await apiPost<ApiResponse<Gallery>>(
        '/v1.0/admin/gallery/get',
        { slug: params.slug }
      );

      if (!result.success) {
        throw new Error(typeof result.data === 'string' ? result.data : 'Failed to load gallery');
      }

      const galleryData = result.data;
      setGallery(galleryData);

      setFormData({
        post_title: galleryData.post_title || '',
        category: galleryData.category || '',
        location: galleryData.location || '',
        deskripsi: galleryData.deskripsi || '',
        tanggal_unggahan: galleryData.tanggal_unggahan || '',
        style_view: galleryData.style_view || '1-Grid'
      });

      const images: (string | null)[] = [];
      for (let i = 1; i <= 30; i++) {
        const imageKey = `image_url${i}` as keyof Gallery;
        images.push(galleryData[imageKey] as string || null);
      }
      setCurrentImages(images);

      const videos: (string | null)[] = [];
      for (let i = 1; i <= 15; i++) {
        const videoKey = `video_url${i}` as keyof Gallery;
        videos.push(galleryData[videoKey] as string || null);
      }
      setCurrentVideos(videos);

      if (galleryData.thumbnail) {
        const thumbIndex = images.findIndex(img => img === galleryData.thumbnail);
        setThumbnailIndex(thumbIndex);
      }

      setMediaChanges([]);
      setHasUnsavedChanges(false);

    } catch (err) {
      console.error('Error fetching gallery:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkUnsavedChanges = () => {
    if (!gallery) return false;

    const formChanged = (
      formData.post_title !== gallery.post_title ||
      formData.category !== gallery.category ||
      formData.location !== (gallery.location || '') ||
      formData.deskripsi !== (gallery.deskripsi || '') ||
      formData.tanggal_unggahan !== (gallery.tanggal_unggahan || '') ||
      formData.style_view !== gallery.style_view
    );

    const mediaChanged = mediaChanges.length > 0;

    return formChanged || mediaChanged;
  };

  useEffect(() => {
        if (user?.email) {
          document.title = `${formData.post_title} | ${user.email}`;
        } 
      }, [user?.email, formData.post_title]);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      setMediaChanges(prev => {
        const filtered = prev.filter(change => !(change.type === 'image' && change.index === index));
        return [...filtered, {
          action: 'upload',
          index,
          type: 'image',
          file,
          preview
        }];
      });

      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (index: number, file: File) => {
    const preview = URL.createObjectURL(file);

    setCurrentVideos(prev => {
      const newVideos = [...prev];
      newVideos[index] = preview;
      return newVideos;
    });

    setMediaChanges(prev => {
      const filtered = prev.filter(change => !(change.type === 'video' && change.index === index));
      return [...filtered, {
        action: 'upload',
        index,
        type: 'video',
        file,
        preview
      }];
    });

    setHasUnsavedChanges(true);
  };

  const handleMediaDelete = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {

      if (index === thumbnailIndex) {
        setThumbnailIndex(-1);
      }

      setCurrentImages(prev => {
        const newImages = [...prev];
        newImages[index] = null;
        return newImages;
      });
    } else {
      setCurrentVideos(prev => {
        const newVideos = [...prev];
        newVideos[index] = null;
        return newVideos;
      });
    }

    setMediaChanges(prev => {
      const filtered = prev.filter(change => !(change.type === type && change.index === index));

      const originalKey = type === 'image' ? `image_url${index + 1}` : `video_url${index + 1}`;
      if (gallery && gallery[originalKey as keyof Gallery]) {
        return [...filtered, {
          action: 'delete',
          index,
          type
        }];
      }

      return filtered;
    });

    setHasUnsavedChanges(true);
  };

  const handleThumbnailSelect = (index: number) => {
    if (currentImages[index]) {
      setThumbnailIndex(index);
      setHasUnsavedChanges(true);
    }
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

      if (!formData.post_title.trim()) {
        setError('Judul portofolio harus diisi');
        return;
      }

      if (!formData.category.trim()) {
        setError('Kategori harus diisi');
        return;
      }

      if (thumbnailIndex === -1 || !currentImages[thumbnailIndex]) {
        setError('Thumbnail harus dipilih dari salah satu gambar');
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append('id', gallery!.id.toString());
      formDataToSend.append('post_title', formData.post_title.trim());
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('location', formData.location);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('tanggal_unggahan', formData.tanggal_unggahan);
      formDataToSend.append('style_view', formData.style_view);
      formDataToSend.append('thumbnail_index', thumbnailIndex.toString());

      mediaChanges.forEach(change => {
        if (change.action === 'delete') {
          formDataToSend.append(`delete_${change.type}_${change.index + 1}`, 'true');
        } else if (change.action === 'upload' && change.file) {
          if (change.type === 'image') {
            formDataToSend.append(`image_${change.index + 1}`, change.file);
          } else {
            formDataToSend.append(`video_${change.index + 1}`, change.file);
          }
        }
      });

      const result = await apiFormData<ApiResponse<any>>(
        '/v1.0/admin/gallery/update',
        formDataToSend
      );

      if (result.success) {
        setSuccess('Portofolio berhasil diupdate');
        setError('');

        setMediaChanges([]);
        setHasUnsavedChanges(false);

        await fetchGallery();
      } else {
        setError(result.data || 'Gagal mengupdate portofolio');
      }
    } catch (err) {
      console.error('Save error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Gagal menyimpan portofolio');
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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

  if (loading) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data portofolio...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!gallery) {
    return (
      <ProtectedRoute requiredRole="moderator">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Portofolio Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Portofolio yang Anda cari tidak ditemukan atau sudah dihapus.</p>
            <Link
              href="/dashboard/kelola-portofolio"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Kelola Portofolio
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const canSave = formData.post_title.trim() && formData.category.trim() && thumbnailIndex !== -1 && currentImages[thumbnailIndex];

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
        <div className="max-w-5xl mx-auto px-4">
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

            <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Edit3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Portofolio</h1>
                    <p className="text-sm lg:text-base text-gray-600">{gallery.post_title}</p>
                    {hasUnsavedChanges && (
                      <span className="inline-flex items-center text-xs text-orange-600 mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Ada perubahan yang belum disimpan
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving || !canSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Kategori portofolio"
                    required
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Unggahan
                  </label>
                  <input
                    type="text"
                    value={formData.tanggal_unggahan}
                    onChange={(e) => handleFormChange('tanggal_unggahan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: 25 Juli 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Style View
                  </label>
                  <select
                    value={formData.style_view}
                    onChange={(e) => handleFormChange('style_view', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1-Grid">1-Grid</option>
                    <option value="3-Grid">3-Grid</option>
                  </select>
                </div>
              </div>
            </div>

            {}
            <CollapsibleSection
              title="Gambar Portofolio"
              subtitle="Upload gambar portofolio (maksimal 20MB per gambar, format: JPG, PNG, WebP)"
              icon={<ImageIcon className="w-5 h-5 text-green-600" />}
              defaultOpen={true}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-green-50"
            >
              <div className="space-y-4">
                {}
                <div className={`border rounded-lg p-3 ${thumbnailIndex !== -1 && currentImages[thumbnailIndex] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  {thumbnailIndex !== -1 && currentImages[thumbnailIndex] ? (
                    <>
                      <Check className="w-4 h-4 inline mr-2 text-green-600" />
                      <span className="text-sm text-green-700">
                        <strong>Thumbnail dipilih:</strong> Gambar {thumbnailIndex + 1}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 inline mr-2 text-red-600" />
                      <span className="text-sm text-red-700">
                        <strong>Pilih thumbnail!</strong> Klik tombol "Set Thumbnail" pada salah satu gambar.
                      </span>
                    </>
                  )}
                </div>

                {}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 30 }, (_, index) => {
                    const currentImage = currentImages[index];
                    const isThumb = index === thumbnailIndex;

                    return (
                      <div key={index} className="relative">
                        <div className={`aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-all duration-200 ${
                          isThumb ? 'border-green-300 bg-green-50 ring-2 ring-green-200' : 'border-gray-300 hover:border-gray-400'
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
                              {isThumb && (
                                <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-sm flex items-center">
                                  <Star className="w-3 h-3 mr-1" />
                                  Thumbnail
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200">
                                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                                  {!isThumb && (
                                    <button
                                      onClick={() => handleThumbnailSelect(index)}
                                      className="p-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                                      title="Set sebagai thumbnail"
                                    >
                                      <Star className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleMediaDelete(index, 'image')}
                                    className="p-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                    title={`Hapus gambar ${index + 1}`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <label className="cursor-pointer flex flex-col items-center hover:text-gray-600 transition-colors">
                                <ImageIcon className="w-4 h-4 text-gray-400 mb-1" />
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
                          <span className="text-xs text-gray-500">Gambar {index + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>

            {}
            <CollapsibleSection
              title="Video Portofolio"
              subtitle="Upload video portofolio (maksimal 100MB per video, format: MP4, WebM, MOV)"
              icon={<Video className="w-5 h-5 text-blue-600" />}
              defaultOpen={false}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-blue-50"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }, (_, index) => {
                    const currentVideo = currentVideos[index];

                    return (
                      <div key={index} className="relative">
                        <div className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-all duration-200 border-gray-300 hover:border-gray-400">
                          {currentVideo ? (
                            <div className="relative w-full h-full group">
                              <video
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                              >
                                <source 
                                  src={currentVideo.startsWith('blob:') 
                                    ? currentVideo 
                                    : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787'}/${currentVideo}`
                                  } 
                                />
                              </video>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleMediaDelete(index, 'video')}
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  title={`Hapus video ${index + 1}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <label className="cursor-pointer flex flex-col items-center hover:text-gray-600 transition-colors">
                                <Video className="w-4 h-4 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Upload</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleVideoUpload(index, file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs text-gray-500">Video {index + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleSection>

            {}
            <CollapsibleSection
              title="Deskripsi Portofolio"
              subtitle="Tulis deskripsi lengkap portofolio dengan format yang menarik"
              icon={<FileText className="w-5 h-5 text-orange-600" />}
              defaultOpen={false}
              className="transition-all duration-300 hover:shadow-lg"
              headerClassName="hover:bg-orange-50"
            >
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <TinyMCEEditor
                    id="description-editor"
                    value={formData.deskripsi}
                    onChange={(content) => handleFormChange('deskripsi', content)}
                    height={400}
                    placeholder="Tulis deskripsi lengkap portofolio... Gunakan toolbar untuk formatting text."
                  />
                </div>

                {formData.deskripsi && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formData.deskripsi.replace(/<[^>]*>/g, '').length} karakter</span>
                  </div>
                )}

                {!formData.deskripsi && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada deskripsi portofolio</p>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditPortofolioPage;