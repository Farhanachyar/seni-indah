import { useState, useCallback } from 'react';
import { useAuthContext } from '../components/AuthProvider';

interface ActivityLogRequest {
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceTitle?: string;
  oldData?: any;
  newData?: any;
  description?: string;
}

interface ActivityResponse {
  success: boolean;
  data: any;
  message?: string;
}

interface RecentActivity {
  id: number;
  username: string;
  action: string;
  resource_type: string;
  resource_title: string;
  description: string;
  created_at: string;
  created_at_formatted: string;
  time_ago: string;
}

export const useActivityMonitor = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8787';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  });

  const logActivity = useCallback(async (
    action: string,
    resourceType: string,
    resourceId?: string,
    resourceTitle?: string,
    oldData?: any,
    newData?: any,
    description?: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      setLoading(true);
      setError(null);

      const requestBody: ActivityLogRequest = {
        action,
        resourceType,
        resourceId,
        resourceTitle,
        oldData,
        newData,
        description
      };

      const response = await fetch(`${apiUrl}/v1.0/admin/log-activity`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      const result = await response.json() as ActivityResponse;

      if (result.success) {
        return { success: true };
      } else {
        const errorMsg = typeof result.data === 'string' ? result.data : 'Gagal mencatat aktivitas';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }

    } catch (error) {
      console.error('Log activity error:', error);
      const errorMsg = 'Terjadi kesalahan saat mencatat aktivitas';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [user, apiUrl]);

  const getRecentActivities = useCallback(async (limit: number = 20): Promise<{
    success: boolean;
    activities: RecentActivity[];
    message?: string;
  }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/v1.0/admin/recent-activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ limit })
      });

      const result = await response.json() as ActivityResponse;

      if (result.success && result.data.activities) {
        return {
          success: true,
          activities: result.data.activities
        };
      } else {
        const errorMsg = typeof result.data === 'string' ? result.data : 'Gagal mengambil aktivitas terbaru';
        setError(errorMsg);
        return { success: false, activities: [], message: errorMsg };
      }

    } catch (error) {
      console.error('Get recent activities error:', error);
      const errorMsg = 'Terjadi kesalahan saat mengambil aktivitas';
      setError(errorMsg);
      return { success: false, activities: [], message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const getActivityStats = useCallback(async (dateFrom?: string, dateTo?: string): Promise<{
    success: boolean;
    stats: any;
    message?: string;
  }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/v1.0/admin/activity-stats`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dateFrom, dateTo })
      });

      const result = await response.json() as ActivityResponse;

      if (result.success) {
        return {
          success: true,
          stats: result.data.statistics
        };
      } else {
        const errorMsg = typeof result.data === 'string' ? result.data : 'Gagal mengambil statistik aktivitas';
        setError(errorMsg);
        return { success: false, stats: null, message: errorMsg };
      }

    } catch (error) {
      console.error('Get activity stats error:', error);
      const errorMsg = 'Terjadi kesalahan saat mengambil statistik';
      setError(errorMsg);
      return { success: false, stats: null, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const logSystemDataLevel1 = useCallback(async (
    action: 'CREATE' | 'UPDATE',
    title: string,
    oldValue?: string,
    newValue?: string
  ) => {
    const titleMap: { [key: string]: string } = {
      'category_information': 'Informasi Kategori',
      'slogan': 'Slogan',
      'whatsapp': 'WhatsApp',
      'store_location': 'Lokasi Toko'
    };

    const resourceTitle = titleMap[title] || title;
    const description = action === 'UPDATE' 
      ? `Mengubah ${resourceTitle} dari "${oldValue || 'kosong'}" menjadi "${newValue || 'kosong'}"`
      : `Membuat ${resourceTitle} dengan nilai "${newValue || 'kosong'}"`;

    return await logActivity(
      action,
      'system_data_lv1',
      title,
      resourceTitle,
      oldValue ? { title, value: oldValue } : null,
      newValue ? { title, value: newValue } : null,
      description
    );
  }, [logActivity]);

  const logSystemDataLevel2 = useCallback(async (
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    type: 'faq' | 'slidingTexts',
    id?: number,
    oldData?: any,
    newData?: any
  ) => {
    const typeLabel = type === 'faq' ? 'FAQ' : 'Sliding Text';
    let description = '';
    let resourceTitle = '';

    if (action === 'CREATE') {
      if (type === 'faq') {
        description = `Menambah FAQ baru: "${newData?.ask}"`;
        resourceTitle = `FAQ: ${newData?.ask?.substring(0, 50)}...`;
      } else {
        description = `Menambah Sliding Text baru: "${newData?.value}"`;
        resourceTitle = `Sliding Text: ${newData?.value?.substring(0, 50)}...`;
      }
    } else if (action === 'UPDATE') {
      if (type === 'faq') {
        description = `Mengubah FAQ: "${oldData?.ask}" → "${newData?.ask}"`;
        resourceTitle = `FAQ: ${newData?.ask?.substring(0, 50)}...`;
      } else {
        description = `Mengubah Sliding Text: "${oldData?.value}" → "${newData?.value}"`;
        resourceTitle = `Sliding Text: ${newData?.value?.substring(0, 50)}...`;
      }
    } else if (action === 'DELETE') {
      if (type === 'faq') {
        description = `Menghapus FAQ: "${oldData?.ask}"`;
        resourceTitle = `FAQ: ${oldData?.ask?.substring(0, 50)}...`;
      } else {
        description = `Menghapus Sliding Text: "${oldData?.value}"`;
        resourceTitle = `Sliding Text: ${oldData?.value?.substring(0, 50)}...`;
      }
    }

    return await logActivity(
      action,
      'system_data_lv2',
      id?.toString(),
      resourceTitle,
      oldData,
      newData,
      description
    );
  }, [logActivity]);

  const logUserManagement = useCallback(async (
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'CHANGE_PASSWORD',
    targetUserId: number,
    targetUsername: string,
    oldData?: any,
    newData?: any
  ) => {
    let description = '';

    switch (action) {
      case 'CREATE':
        description = `Membuat user baru: ${targetUsername} dengan role ${newData?.role || 'unknown'}`;
        break;
      case 'UPDATE':
        if (oldData?.role !== newData?.role) {
          description = `Mengubah role ${targetUsername} dari ${oldData?.role || 'unknown'} menjadi ${newData?.role || 'unknown'}`;
        } else {
          description = `Memperbarui data user: ${targetUsername}`;
        }
        break;
      case 'DELETE':
        description = `Menghapus user: ${targetUsername}`;
        break;
      case 'CHANGE_PASSWORD':
        description = `Mengubah password untuk user: ${targetUsername}`;
        break;
    }

    return await logActivity(
      action,
      'user_auth',
      targetUserId.toString(),
      targetUsername,
      oldData,
      newData,
      description
    );
  }, [logActivity]);

  const logAuthentication = useCallback(async (
    action: 'LOGIN' | 'LOGOUT' | 'CHANGE_PASSWORD' | 'FAILED_LOGIN',
    details?: any
  ) => {
    const username = user?.name || user?.email || 'Unknown User';
    let description = '';

    switch (action) {
      case 'LOGIN':
        description = `${username} berhasil login ke sistem`;
        break;
      case 'LOGOUT':
        description = `${username} logout dari sistem`;
        break;
      case 'CHANGE_PASSWORD':
        description = `${username} mengubah password`;
        break;
      case 'FAILED_LOGIN':
        description = `Percobaan login gagal untuk ${username}`;
        break;
    }

    return await logActivity(
      action,
      'authentication',
      user?.id?.toString(),
      username,
      null,
      details,
      description
    );
  }, [logActivity, user]);

  const formatTimeAgo = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {

    loading,
    error,

    logActivity,
    getRecentActivities,
    getActivityStats,

    logSystemDataLevel1,
    logSystemDataLevel2,
    logUserManagement,
    logAuthentication,

    formatTimeAgo,
    clearError
  };
};