'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../../../components/AuthProvider';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { 
  Activity, 
  ArrowLeft,
  Filter,
  Download,
  Search,
  Calendar,
  User,
  RefreshCw,
  Undo2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Database,
  Settings,
  Shield,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

import { apiPost, ApiError } from '../../../../utils/apiClient';

interface ActivityLog {
  id: number;
  user_id: number;
  username: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  resource_type: string;
  resource_id: string;
  resource_title: string;
  old_data: any;
  new_data: any;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  created_at_formatted: string;
}

interface FilterOptions {
  userId?: number;
  action?: string;
  resourceType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ActivityLogsResponse {
  logs: ActivityLog[];
  pagination?: { total: number };
}

const ActivityLogsPage: React.FC = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [rollbackLoading, setRollbackLoading] = useState<number | null>(null);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showRollbackModal, setShowRollbackModal] = useState(false);

  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      document.title = `Logs Activity | ${user.email}`;
    } 
  }, [user?.email]);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const requestBody = {
        page: currentPage,
        limit: itemsPerPage,
        ...filters
      };

      const result = await apiPost<ApiResponse<ActivityLogsResponse>>(
        '/v1.0/admin/activity-logs',
        requestBody
      );

      if (result.success) {
        setLogs(result.data.logs || []);
        setTotalLogs(result.data.pagination?.total || result.data.logs?.length || 0);
      } else {
        setError('Gagal memuat log aktivitas');
      }
    } catch (err) {
      console.error('Load activity logs error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (log: ActivityLog) => {
    if (!log.old_data || log.action === 'CREATE') {
      setError('Data tidak dapat dikembalikan');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin mengembalikan perubahan "${log.description}"?`)) {
      return;
    }

    try {
      setRollbackLoading(log.id);
      setError('');

      let rollbackEndpoint = '';
      let rollbackPayload: any = {};

      switch (log.resource_type) {
        case 'system_data_lv1':
          rollbackEndpoint = '/v1.0/admin/system-data';
          rollbackPayload = {
            action: 'update',
            level: 1,
            title: log.resource_id,
            value: log.old_data.value
          };
          break;

        case 'system_data_lv2':
          if (log.action === 'DELETE') {

            rollbackEndpoint = '/v1.0/admin/system-data';
            rollbackPayload = {
              action: 'create',
              level: 2,
              title: log.old_data.title,
              ask: log.old_data.ask,
              answer: log.old_data.answer,
              value: log.old_data.value,
              updated_by: `${user?.name || user?.email} (Rollback)`
            };
          } else {

            rollbackEndpoint = '/v1.0/admin/system-data';
            rollbackPayload = {
              action: 'update',
              level: 2,
              id: parseInt(log.resource_id),
              title: log.old_data.title,
              ask: log.old_data.ask,
              answer: log.old_data.answer,
              value: log.old_data.value,
              updated_by: `${user?.name || user?.email} (Rollback)`
            };
          }
          break;

        case 'products':
          rollbackEndpoint = '/v1.0/admin/rollback/product';
          rollbackPayload = {
            log_id: log.id,
            product_id: parseInt(log.resource_id),
            rollback_to: log.old_data
          };
          break;

        case 'categories':
          rollbackEndpoint = '/v1.0/admin/rollback/category';
          rollbackPayload = {
            log_id: log.id,
            category_id: parseInt(log.resource_id),
            rollback_to: log.old_data
          };
          break;

        case 'system_gallery':
          rollbackEndpoint = '/v1.0/admin/rollback/gallery';
          rollbackPayload = {
            log_id: log.id,
            gallery_id: parseInt(log.resource_id),
            rollback_to: log.old_data
          };
          break;

        default:
          setError(`Rollback untuk resource type "${log.resource_type}" belum didukung`);
          return;
      }

      const result = await apiPost<ApiResponse<any>>(
        rollbackEndpoint,
        rollbackPayload
      );

      if (result.success) {
        setMessage(`Rollback berhasil: ${log.description}`);

        await loadActivityLogs();
      } else {
        setError(typeof result.data === 'string' ? result.data : 'Gagal melakukan rollback');
      }

    } catch (err) {
      console.error('Rollback error:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Gagal melakukan rollback');
      }
    } finally {
      setRollbackLoading(null);
    }
  };

  useEffect(() => {
    loadActivityLogs();
  }, [currentPage, itemsPerPage, filters]);

  const toggleExpandedLog = (logId: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getActionDisplay = (action: string) => {
    switch (action) {
      case 'CREATE':
        return {
          text: 'CREATE',
          icon: <Plus className="w-3 h-3" />,
          color: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'UPDATE':
        return {
          text: 'UPDATE',
          icon: <Edit3 className="w-3 h-3" />,
          color: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      case 'DELETE':
        return {
          text: 'DELETE',
          icon: <Trash2 className="w-3 h-3" />,
          color: 'bg-red-100 text-red-700 border-red-200'
        };
      case 'LOGIN':
        return {
          text: 'LOGIN',
          icon: <Shield className="w-3 h-3" />,
          color: 'bg-purple-100 text-purple-700 border-purple-200'
        };
      case 'LOGOUT':
        return {
          text: 'LOGOUT',
          icon: <Shield className="w-3 h-3" />,
          color: 'bg-gray-100 text-gray-700 border-gray-200'
        };
      default:
        return {
          text: action,
          icon: <Activity className="w-3 h-3" />,
          color: 'bg-gray-100 text-gray-700 border-gray-200'
        };
    }
  };

  const getResourceTypeDisplay = (resourceType: string) => {
    switch (resourceType) {
      case 'system_data_lv1':
        return 'System Config';
      case 'system_data_lv2':
        return 'System Data';
      case 'system_gallery':
        return 'Gallery';
      case 'authentication':
        return 'Authentication';
      default:
        return resourceType.replace('_', ' ').toUpperCase();
    }
  };

  const canRollback = (log: ActivityLog) => {

    if (log.action === 'CREATE') return false;

    if (log.action === 'LOGIN' || log.action === 'LOGOUT') return false;

    if (!log.old_data) return false;

    if (log.resource_type === 'authentication') return false;

    return true;
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const totalPages = Math.ceil(totalLogs / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalLogs);

  if (loading && logs.length === 0) {
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
        <div className="max-w-7xl mx-auto px-4">
          {}
          <div className="mb-4">
            <button
              onClick={() => router.push('/dashboard/security')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Kembali ke Halaman Sebelumnya"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Halaman Sebelumnya</span>
            </button>
          </div>

          {}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
            </div>
            <p className="text-gray-600">
              Monitor aktivitas sistem dan lakukan rollback jika diperlukan
            </p>
          </div>

          {}
          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalLogs}</div>
                  <div className="text-sm text-gray-500">Total Log</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{logs.filter(l => canRollback(l)).length}</div>
                  <div className="text-sm text-gray-500">Dapat Di-rollback</div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Menampilkan {startIndex}-{endIndex} dari {totalLogs} log
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {logs.length > 0 ? (
                <div className="space-y-2 p-4">
                  {logs.map((log) => {
                    const actionDisplay = getActionDisplay(log.action);
                    const isExpanded = expandedLogs.has(log.id);
                    const canRollbackThis = canRollback(log);

                    return (
                      <div key={log.id} className="border border-gray-200 rounded-lg">
                        {}
                        <div className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              {}
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${actionDisplay.color}`}>
                                {actionDisplay.icon}
                                <span>{actionDisplay.text}</span>
                              </div>

                              {}
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{log.description}</div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <User className="w-3 h-3" />
                                    <span>{log.username}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Database className="w-3 h-3" />
                                    <span>{getResourceTypeDisplay(log.resource_type)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{log.created_at_formatted}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {}
                            <div className="flex items-center space-x-2">
                              {canRollbackThis && (
                                <button
                                  onClick={() => handleRollback(log)}
                                  disabled={rollbackLoading === log.id}
                                  className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm disabled:opacity-50"
                                  title="Kembalikan perubahan"
                                >
                                  {rollbackLoading === log.id ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Undo2 className="w-3 h-3" />
                                  )}
                                  <span>Rollback</span>
                                </button>
                              )}

                              {(log.old_data || log.new_data) && (
                                <button
                                  onClick={() => toggleExpandedLog(log.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                  {isExpanded ? (
                                    <>
                                      <EyeOff className="w-3 h-3" />
                                      <span>Sembunyikan</span>
                                      <ChevronUp className="w-3 h-3" />
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3 h-3" />
                                      <span>Detail</span>
                                      <ChevronDown className="w-3 h-3" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {}
                        {isExpanded && (log.old_data || log.new_data) && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {}
                              {log.old_data && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Data Sebelumnya:</h4>
                                  <pre className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm overflow-x-auto">
                                    {JSON.stringify(log.old_data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {}
                              {log.new_data && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Data Sesudahnya:</h4>
                                  <pre className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm overflow-x-auto">
                                    {JSON.stringify(log.new_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>

                            {}
                            <div className="mt-4 pt-4 border-t border-gray-300">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <strong>IP Address:</strong> {log.ip_address || 'Unknown'}
                                </div>
                                <div>
                                  <strong>User Agent:</strong> {log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'Unknown'}
                                </div>
                                <div>
                                  <strong>Resource ID:</strong> {log.resource_id}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada log aktivitas</h3>
                  <p className="text-gray-500">Log aktivitas akan muncul di sini ketika ada aktivitas sistem.</p>
                </div>
              )}
            </div>
          </div>

          {}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan {startIndex} hingga {endIndex} dari {totalLogs} log
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Halaman {currentPage} dari {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ActivityLogsPage;