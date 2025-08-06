'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  HelpCircle, 
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
  ask?: string;
  answer?: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

const FAQPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [faqData, setFaqData] = useState<SystemDataLevel2[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFaqData, setNewFaqData] = useState({ ask: '', answer: '' });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
      if (user?.email) {
        document.title = `FAQ Settings | ${user.email}`;
      } 
    }, [user?.email]);

  useEffect(() => {
    loadFaqData();
  }, []);

  const loadFaqData = async () => {
    try {
      setLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {}
      );

      if (result.success) {
        if (typeof result.data === 'object' && result.data.level2) {
          const faqItems = result.data.level2.filter((item: SystemDataLevel2) => item.title === 'faq');
          setFaqData(faqItems || []);
        } else {
          setError('Format data tidak valid');
        }
      } else {
        setError(typeof result.data === 'string' ? result.data : result.message || 'Gagal memuat data FAQ');
      }
    } catch (error) {
      console.error('Load FAQ data error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat memuat data');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveFaqData = async (id: number | null, data: { ask: string; answer: string }) => {
    try {
      setSaveLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {
          action: id ? 'update' : 'create',
          level: 2,
          id,
          title: 'faq',
          ...data,
          updated_by: user?.name || user?.email
        }
      );

      if (result.success) {
        setMessage(id ? 'FAQ berhasil diperbarui' : 'FAQ berhasil ditambahkan');
        setEditingId(null);
        setShowAddForm(false);
        setEditValues({});
        setNewFaqData({ ask: '', answer: '' });
        await loadFaqData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Save FAQ data error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteFaqData = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return;

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
        setMessage('FAQ berhasil dihapus');
        await loadFaqData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Delete FAQ data error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menghapus data');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const renderFaqItem = (item: SystemDataLevel2, index: number) => {
    const isEditing = editingId === item.id;

    return (
      <div key={`faq-${item.id || index}`} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-500">
                Diperbarui oleh: {item.updated_by} | {new Date(item.updated_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveFaqData(item.id || null, { ask: editValues.ask, answer: editValues.answer })}
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
                    setEditValues({ ask: item.ask, answer: item.answer });
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteFaqData(item.id || index)}
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

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
            {isEditing ? (
              <input
                type="text"
                value={editValues.ask || ''}
                onChange={(e) => setEditValues({ ...editValues, ask: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Masukkan pertanyaan"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{item.ask}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            {isEditing ? (
              <textarea
                value={editValues.answer || ''}
                onChange={(e) => setEditValues({ ...editValues, answer: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Masukkan jawaban"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
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
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">FAQ (Frequently Asked Questions)</h1>
                  <p className="text-gray-600">Kelola pertanyaan dan jawaban yang sering ditanyakan</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setNewFaqData({ ask: '', answer: '' });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ</span>
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
                  Tambah FAQ Baru
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                  <input
                    type="text"
                    value={newFaqData.ask}
                    onChange={(e) => setNewFaqData({ ...newFaqData, ask: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Masukkan pertanyaan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
                  <textarea
                    value={newFaqData.answer}
                    onChange={(e) => setNewFaqData({ ...newFaqData, answer: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Masukkan jawaban"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => saveFaqData(null, { ask: newFaqData.ask, answer: newFaqData.answer })}
                  disabled={saveLoading || !newFaqData.ask || !newFaqData.answer}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daftar FAQ</h2>
            {faqData.length > 0 ? (
              faqData.map((item, index) => renderFaqItem(item, index))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada FAQ</h3>
                <p className="text-gray-500 mb-4">Belum ada pertanyaan dan jawaban yang ditambahkan.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah FAQ Pertama</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FAQPage;