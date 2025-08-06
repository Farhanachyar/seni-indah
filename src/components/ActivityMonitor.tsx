'use client';

import React, { useState, useEffect } from 'react';
import { useActivityMonitor } from '../hooks/useActivityMonitor';
import { 
  AlertCircle, 
  X, 
  RefreshCw, 
  Clock, 
  User, 
  Activity,
  ChevronDown,
  ChevronUp,
  Download,
  Filter
} from 'lucide-react';

interface ActivityMonitorProps {

  className?: string;
  compact?: boolean;
  showHeader?: boolean;
  maxHeight?: string;

  autoRefresh?: boolean;
  refreshInterval?: number; 
  limit?: number;
  showStats?: boolean;
  showExport?: boolean;

  onActivityLogged?: (activity: any) => void;
  onError?: (error: string) => void;
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

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({
  className = '',
  compact = false,
  showHeader = true,
  maxHeight = '400px',
  autoRefresh = false,
  refreshInterval = 30000, 
  limit = 20,
  showStats = false,
  showExport = false,
  onActivityLogged,
  onError
}) => {
  const { 
    getRecentActivities, 
    getActivityStats,
    loading, 
    error,
    formatTimeAgo,
    clearError 
  } = useActivityMonitor();

  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterResourceType, setFilterResourceType] = useState<string>('');

  const loadActivities = async () => {
    try {
      const result = await getRecentActivities(limit);
      if (result.success) {
        setActivities(result.activities);
        setLastRefresh(new Date());

        if (onActivityLogged && result.activities.length > 0) {
          onActivityLogged(result.activities[0]);
        }
      } else if (result.message && onError) {
        onError(result.message);
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
      if (onError) {
        onError('Gagal memuat aktivitas terbaru');
      }
    }
  };

  const loadStats = async () => {
    if (!showStats) return;

    try {
      const result = await getActivityStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    loadActivities();
    loadStats();

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        loadActivities();
        loadStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, limit, showStats]);

  const filteredActivities = activities.filter(activity => {
    const matchesAction = !filterAction || activity.action === filterAction;
    const matchesResourceType = !filterResourceType || activity.resource_type === filterResourceType;
    return matchesAction && matchesResourceType;
  });

  const uniqueActions = Array.from(new Set(activities.map(a => a.action)));
  const uniqueResourceTypes = Array.from(new Set(activities.map(a => a.resource_type)));

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return { icon: '+', color: 'bg-green-500' };
      case 'UPDATE': return { icon: '↻', color: 'bg-blue-500' };
      case 'DELETE': return { icon: '−', color: 'bg-red-500' };
      case 'LOGIN': return { icon: '→', color: 'bg-purple-500' };
      case 'LOGOUT': return { icon: '←', color: 'bg-gray-500' };
      default: return { icon: '?', color: 'bg-gray-500' };
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Username', 'Action', 'Resource Type', 'Description', 'Time'].join(','),
      ...filteredActivities.map(activity => [
        activity.username,
        activity.action,
        activity.resource_type,
        `"${activity.description}"`,
        activity.created_at_formatted
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activities-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (compact && !isExpanded) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div 
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Aktivitas ({activities.length})
            </span>
            {activities.length > 0 && (
              <span className="text-xs text-green-600">
                {formatTimeAgo(activities[0].created_at)}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Aktivitas Terbaru
              </h3>
              <p className="text-sm text-gray-500">
                Terakhir diperbarui: {lastRefresh.toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {}
            <button
              onClick={() => {
                loadActivities();
                loadStats();
              }}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {}
            {showExport && (
              <button
                onClick={handleExport}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {}
            {compact && (
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {}
      {!compact && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Filter:</span>
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Aksi</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>

            <select
              value={filterResourceType}
              onChange={(e) => setFilterResourceType(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Resource</option>
              {uniqueResourceTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            {(filterAction || filterResourceType) && (
              <button
                onClick={() => {
                  setFilterAction('');
                  setFilterResourceType('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {}
      {showStats && stats && (
        <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-900">
                  {stats.byAction?.CREATE || 0}
                </div>
                <div className="text-xs text-blue-700">CREATE</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-900">
                  {stats.byAction?.UPDATE || 0}
                </div>
                <div className="text-xs text-blue-700">UPDATE</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-900">
                  {stats.byAction?.DELETE || 0}
                </div>
                <div className="text-xs text-blue-700">DELETE</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {loading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Memuat aktivitas...</span>
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="space-y-2 p-4">
            {filteredActivities.map((activity) => {
              const { icon, color } = getActivityIcon(activity.action);

              return (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${color}`}>
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <User className="w-3 h-3" />
                      <span>{activity.username}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(activity.created_at)}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {activity.resource_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Activity className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm">
              {filterAction || filterResourceType 
                ? 'Tidak ada aktivitas yang sesuai filter' 
                : 'Belum ada aktivitas terbaru'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityMonitor;