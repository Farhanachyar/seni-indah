'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  FileText, 
  Save, 
  Edit, 
  Check, 
  X, 
  AlertCircle,
  Info,
  MessageSquare,
  Phone,
  MapPin,
  Tag,
  ArrowLeft
} from 'lucide-react';

import { apiPost, ApiError } from '../../../../utils/apiClient';

interface SystemDataLevel1 {
  title: string;
  value: string;
  created_at: string;
  updated_at: string;
}

const KonfigurasiDasarPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [level1Data, setLevel1Data] = useState<SystemDataLevel1[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingLevel1, setEditingLevel1] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
      if (user?.email) {
        document.title = `Konfigurasi | ${user.email}`;
      } 
    }, [user?.email]);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {}
      );

      if (result.success) {
        if (typeof result.data === 'object' && result.data.level1) {
          setLevel1Data(result.data.level1 || []);
        } else {
          setError('Format data tidak valid');
        }
      } else {
        setError(typeof result.data === 'string' ? result.data : result.message || 'Gagal memuat data sistem');
      }
    } catch (error) {
      console.error('Load system data error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat memuat data');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveLevel1Data = async (title: string, value: string) => {
    try {
      setSaveLoading(true);

      const result = await apiPost<{ success: boolean; data: any; message?: string }>(
        '/v1.0/admin/system-data',
        {
          action: 'update',
          level: 1,
          title,
          value
        }
      );

      if (result.success) {
        setMessage('Data berhasil disimpan');
        setEditingLevel1(null);
        setEditValues({});
        await loadSystemData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Save level1 data error:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const getLevel1Icon = (title: string) => {
    switch (title) {
      case 'category_information': return <Info className="w-5 h-5" />;
      case 'slogan': return <MessageSquare className="w-5 h-5" />;
      case 'whatsapp': return <Phone className="w-5 h-5" />;
      case 'store_location': return <MapPin className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  const getLevel1Label = (title: string) => {
    switch (title) {
      case 'category_information': return 'Informasi Kategori';
      case 'slogan': return 'Slogan';
      case 'whatsapp': return 'WhatsApp';
      case 'store_location': return 'Lokasi Toko';
      default: return title.replace(/_/g, ' ').toUpperCase();
    }
  };

  const renderLevel1Item = (item: SystemDataLevel1) => {
    const isEditing = editingLevel1 === item.title;
    const currentValue = isEditing ? (editValues[item.title] || item.value) : item.value;

    return (
      <div key={item.title} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {getLevel1Icon(item.title)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getLevel1Label(item.title)}
              </h3>
              <p className="text-sm text-gray-500">
                Terakhir diperbarui: {new Date(item.updated_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => saveLevel1Data(item.title, currentValue)}
                  disabled={saveLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={() => {
                    setEditingLevel1(null);
                    setEditValues({});
                  }}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditingLevel1(item.title);
                  setEditValues({ [item.title]: item.value });
                }}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={currentValue}
            onChange={(e) => setEditValues({ ...editValues, [item.title]: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder={`Masukkan ${getLevel1Label(item.title).toLowerCase()}`}
          />
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{item.value}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Dasar</h1>
                <p className="text-gray-600">Kelola informasi dasar sistem seperti slogan, kontak, dan lokasi toko</p>
              </div>
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Konfigurasi Sistem</h2>
            {level1Data.length > 0 ? (
              level1Data.map(renderLevel1Item)
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada konfigurasi</h3>
                <p className="text-gray-500">Data konfigurasi sistem belum tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default KonfigurasiDasarPage;