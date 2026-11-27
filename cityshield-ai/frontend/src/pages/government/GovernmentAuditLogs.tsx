import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Clock, FileText } from 'lucide-react';

export const GovernmentAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then(res => setLogs(res.logs || [])).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Audit Log Ledger</h1>
          <p className="text-xs text-text-muted mt-0.5">Immutable record of official status changes, remarks, and work order transitions.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="divide-y divide-slate-100">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-primary">{log.entityId}</span>
                      <span className="font-semibold text-slate-800">{log.action}</span>
                    </div>
                    <div className="text-slate-600 mt-1">
                      Action performed by <strong className="text-slate-900">{log.performedBy}</strong> ({log.role})
                    </div>
                  </div>
                  <div className="text-[11px] text-text-muted font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-text-muted">
                No recent audit log entries found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
