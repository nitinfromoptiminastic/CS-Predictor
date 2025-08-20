'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Clock, User, Activity } from 'lucide-react';
import { AuditLog } from '@/types';

interface AuditLogsProps {
  onClose: () => void;
  userEmail: string;
}

export function AuditLogs({ onClose, userEmail }: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine'>('mine');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '50',
        ...(filter === 'mine' && { userId: userEmail })
      });
      
      const response = await fetch(`/api/audit?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, userEmail]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('mine')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'mine'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Activity
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Activity
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading audit logs...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No activity found</div>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {log.userEmail}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        {log.action}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  {log.fileName && (
                    <div className="text-sm text-gray-600 mb-1">
                      File: {log.fileName} ({log.fileType})
                    </div>
                  )}
                  
                  {log.platforms.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Platforms: {log.platforms.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
