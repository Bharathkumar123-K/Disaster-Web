'use client';

import { useAdmin } from '../../components/admin/AdminProvider';
import { 
  Activity, 
  Database, 
  Users, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Server, 
  PlusCircle, 
  RefreshCw, 
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { overview, loading, toggleFeed, setIsInjectModalOpen, refreshAll } = useAdmin();

  if (loading || !overview) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: 'var(--text-secondary)' }}>
        <RefreshCw size={32} className="animate-spin-slow" color="#f59e0b" />
        <p style={{ fontWeight: 600 }}>Connecting to Level 0 System Telemetry...</p>
      </div>
    );
  }

  const feeds = overview.feeds || {};
  const health = overview.systemHealth || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>System Telemetry & Governance Center</span>
            <span className="admin-badge">ONLINE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time infrastructure monitoring, intake stream controls, and emergency response parameters.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsInjectModalOpen(true)} 
            className="btn btn-approve"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
          >
            <PlusCircle size={16} />
            Simulate Disaster Intake
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="metric-card">
          <div className="metric-title">
            <Database size={14} color="var(--accent-color)" /> Total Incidents
          </div>
          <div className="metric-value font-mono">{overview.totalEvents}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {overview.pendingEvents} pending triage review
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <CheckCircle size={14} color="#10b981" /> Approved Dispatch
          </div>
          <div className="metric-value font-mono" style={{ color: '#10b981' }}>{overview.approvedEvents}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {overview.dismissedEvents} dismissed as noise
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <Users size={14} color="#06b6d4" /> RBAC Users
          </div>
          <div className="metric-value font-mono" style={{ color: '#06b6d4' }}>{overview.totalUsers}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Commanders & Dispatchers active
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <Cpu size={14} color="#f59e0b" /> Heap Memory
          </div>
          <div className="metric-value font-mono" style={{ color: '#f59e0b' }}>{health.memoryUsageMB} <span style={{ fontSize: '1.1rem' }}>MB</span></div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Latency: {health.aiEngineLatencyMs}ms per event
          </div>
        </div>
      </div>

      {/* Ingestion Stream & Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Stream Controllers */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Radio size={18} color="#f59e0b" />
              <span>Real-Time Ingestion Streams</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-sync enabled</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="switch-label">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Twitter / X Emergency Stream</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Social sentiment NLP classifier</div>
              </div>
              <input 
                type="checkbox" 
                className="switch-input" 
                checked={!!feeds.twitterStream} 
                onChange={(e) => toggleFeed('twitterStream', e.target.checked)} 
              />
            </div>

            <div className="switch-label">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>News RSS & Wire Feeds</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>NDMA & ReliefWeb official reports</div>
              </div>
              <input 
                type="checkbox" 
                className="switch-input" 
                checked={!!feeds.rssNews} 
                onChange={(e) => toggleFeed('rssNews', e.target.checked)} 
              />
            </div>

            <div className="switch-label">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Emergency Hotline 112 Ingest</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>National dispatch call telemetry</div>
              </div>
              <input 
                type="checkbox" 
                className="switch-input" 
                checked={!!feeds.emergencyHotline} 
                onChange={(e) => toggleFeed('emergencyHotline', e.target.checked)} 
              />
            </div>

            <div className="switch-label">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Weather Radar & Seismic API</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>IMD & USGS Doppler radar intake</div>
              </div>
              <input 
                type="checkbox" 
                className="switch-input" 
                checked={!!feeds.radarWeather} 
                onChange={(e) => toggleFeed('radarWeather', e.target.checked)} 
              />
            </div>
          </div>
        </div>

        {/* System Cluster Diagnostics */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
              <Server size={18} color="var(--accent-color)" />
              <span>Node Infrastructure Health</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>CLUSTER ACTIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Backend Node Uptime</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }} className="font-mono">{health.uptimeSeconds}s</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Database Connection</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>{health.databaseStatus}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>WebSocket Broadcast Clients</span>
              <span style={{ fontWeight: 700, color: '#06b6d4' }}>{health.activeSocketConnections} Terminals Connected</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ingestion Throughput Rate</span>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{health.ingestionRatePerMin} items / min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Audit Preview */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <Lock size={18} color="#f59e0b" />
            <span>Recent System Audit & Security Trail</span>
          </div>
          <button onClick={refreshAll} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            Refresh Logs
          </button>
        </div>

        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Administrator</th>
                <th>Action</th>
                <th>Category</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {(overview.recentAuditLogs || []).map((log, idx) => (
                <tr key={log._id || idx}>
                  <td className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp || log.createdAt).toLocaleTimeString()}
                  </td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{log.adminUser}</td>
                  <td>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.category}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
