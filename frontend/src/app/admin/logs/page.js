'use client';

import { useState } from 'react';
import { useAdmin } from '../../../components/admin/AdminProvider';
import { 
  Lock, 
  Trash2, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import NexusSelect from '../../../components/NexusSelect';

export default function AdminLogsPage() {
  const { logs, fetchLogs, showToast } = useAdmin();
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    return categoryFilter === 'all' || log.category === categoryFilter;
  });


  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear historical audit logs? (Security logs will be retained)')) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/logs/clear', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Historical non-security logs cleared');
        fetchLogs();
      }
    } catch (e) {
      showToast('Failed to clear logs', 'error');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexus_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Audit logs exported to JSON');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>System Audit & Security Logs</span>
            <span className="admin-badge">IMMUTABLE LOGS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Cryptographically tracked audit entries for administrator actions, feed status changes, and user access events.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExportJSON}
            className="btn btn-dismiss"
            style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff' }}
          >
            <Download size={16} /> Export JSON
          </button>
          <button 
            onClick={handleClearLogs}
            className="btn"
            style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.35)', color: '#f43f5e', fontWeight: 700 }}
          >
            <Trash2 size={16} /> Purge Non-Security Logs
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Filter size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Filter Category:</span>
          <div style={{ minWidth: '220px' }}>
            <NexusSelect 
              value={categoryFilter} 
              onChange={(e, val) => setCategoryFilter(val)}
              options={[
                { value: 'all', label: `All Categories (${logs.length})` },
                { value: 'SECURITY', label: 'Security & Access' },
                { value: 'INGESTION', label: 'Ingestion Streams' },
                { value: 'AI_ENGINE', label: 'AI Calibration' },
                { value: 'INCIDENT_OVERRIDE', label: 'Incident Override' },
                { value: 'USER_MGMT', label: 'User Management' }
              ]}
            />
          </div>
        </div>


        <button onClick={fetchLogs} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
          Refresh Audit Trail
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Administrator</th>
                <th>Action ID</th>
                <th>Category</th>
                <th>Audit Details & Telemetry</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp || log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{log.adminUser}</td>
                  <td>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.category}</td>
                  <td style={{ fontSize: '0.85rem', color: '#ffffff' }}>{log.details}</td>
                  <td className="font-mono" style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
