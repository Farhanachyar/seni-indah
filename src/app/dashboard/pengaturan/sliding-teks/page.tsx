'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  Scroll, 
  Save, 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

import { apiPost, ApiError } from '../../../../utils/apiClient';

interface SystemDataLevel2 {
  id?: number;
  title: string;
  value?: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

const SlidingTeksPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [slidingTexts, setSlidingTexts] = useState<SystemDataLevel2[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTextData, setNewTextData] = useState({ value: '' });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadSlidingTexts();
  }, []);

  useEffect(() => {
    if (user?.email) {
      document.title = `Sliding Text | ${user.email}`;
    } 
  }, [user?.email]);

  const loadSlidingTexts = async () => {
    try {
      setLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {}
      );

      if (result.success) {
        if (typeof result.data === 'object' && result.data.level2) {
          const slidingTextData = result.data.level2.filter((item: SystemDataLevel2) => item.title === 'slidingTexts');
          setSlidingTexts(slidingTextData || []);
        } else {
          setError('Format data tidak valid');
        }
      } else {
        setError(typeof result.data === 'string' ? result.data : result.message || 'Gagal memuat data sliding text');
      }
    } catch (error) {
      console.error('Load sliding texts error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat memuat data');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSlidingText = async (id: number | null, data: { value: string }) => {
    try {
      setSaveLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {
          action: id ? 'update' : 'create',
          level: 2,
          id,
          title: 'slidingTexts',
          ...data,
          updated_by: user?.name || user?.email
        }
      );

      if (result.success) {
        setMessage(id ? 'Sliding text berhasil diperbarui' : 'Sliding text berhasil ditambahkan');
        setEditingId(null);
        setShowAddForm(false);
        setEditValues({});
        setNewTextData({ value: '' });
        await loadSlidingTexts();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Save sliding text error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteSlidingText = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sliding text ini?')) return;

    try {
      setSaveLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {
          action: 'delete',
          level: 2,
          id
        }
      );

      if (result.success) {
        setMessage('Sliding text berhasil dihapus');
        await loadSlidingTexts();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Delete sliding text error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menghapus data');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const renderSlidingTextItem = (item: SystemDataLevel2, index: number) => {
    const isEditing = editingId === item.id;

    return (
      <div key={`sliding-text-${item.id || index}`} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sliding Text</h3>
              <p className="text-sm text-gray-500">
                Diperbarui oleh: {item.updated_by} | {new Date(item.updated_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveSlidingText(item.id || null, { value: editValues.value })}
                  disabled={saveLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditValues({});
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingId(item.id || index);
                    setEditValues({ value: item.value });
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteSlidingText(item.id || index)}
                  disabled={saveLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teks</label>
          {isEditing ? (
            <input
              type="text"
              value={editValues.value || ''}
              onChange={(e) => setEditValues({ ...editValues, value: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan teks sliding"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{item.value}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {}
          <div className="mb-4">
            <button
              onClick={() => router.push('/dashboard/pengaturan')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Kembali ke Pengaturan"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Pengaturan</span>
            </button>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Scroll className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sliding Teks</h1>
                  <p className="text-gray-600">Kelola teks bergerak yang ditampilkan di halaman utama</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setNewTextData({ value: '' });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Sliding Text</span>
              </button>
            </div>
          </div>

          {}
          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tambah Sliding Text Baru
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teks Sliding</label>
                <input
                  type="text"
                  value={newTextData.value}
                  onChange={(e) => setNewTextData({ ...newTextData, value: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan teks sliding"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => saveSlidingText(null, { value: newTextData.value })}
                  disabled={saveLoading || !newTextData.value}
                  className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daftar Sliding Text</h2>
            {slidingTexts.length > 0 ? (
              slidingTexts.map((item, index) => renderSlidingTextItem(item, index))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scroll className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada sliding text</h3>
                <p className="text-gray-500 mb-4">Belum ada teks bergerak yang ditambahkan.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Sliding Text Pertama</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SlidingTeksPage;