'use client';

import { useState } from 'react';
import { useDisaster } from '../../../../components/DisasterProvider';
import { ShieldAlert, Search, Filter, ArrowUpDown, Eye, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ReportsPage() {
  const { events, loading, searchQuery, setSearchQuery, setSelectedEvent } = useDisaster();
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  if (loading) return <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>Initializing Incident Database...</div>;

  const filteredEvents = events.filter(e => {
    const q = searchQuery ? searchQuery.toLowerCase().trim() : '';
    const matchesQuery = !q || (
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.severity && e.severity.toLowerCase().includes(q)) ||
      (e.locationName && e.locationName.toLowerCase().includes(q)) ||
      (e.text && e.text.toLowerCase().includes(q)) ||
      (e.status && e.status.toLowerCase().includes(q))
    );

    const matchesSeverity = selectedSeverity === 'all' || e.severity === selectedSeverity;

    return matchesQuery && matchesSeverity;
  });

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '2rem', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.6rem', fontWeight: 800 }}>
              <ShieldAlert size={28} color="var(--accent-color)" /> Incident Reports Database
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              Comprehensive real-time telemetry log of AI-ingested disasters, triage status, and dispatch history.
            </p>
          </div>

          {/* Controls / Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <select 
                value={selectedSeverity} 
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                <option value="all" style={{ background: '#0f172a', color: '#fff' }}>All Severities</option>
                <option value="critical" style={{ background: '#0f172a', color: '#fff' }}>Critical</option>
                <option value="high" style={{ background: '#0f172a', color: '#fff' }}>High</option>
                <option value="medium" style={{ background: '#0f172a', color: '#fff' }}>Medium</option>
                <option value="low" style={{ background: '#0f172a', color: '#fff' }}>Low</option>
              </select>
            </div>

            {searchQuery && (
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--accent-color)', padding: '0.4rem 0.85rem', borderRadius: '10px', fontSize: '0.82rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                Query: "{searchQuery}" ({filteredEvents.length})
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    CATEGORY <ArrowUpDown size={12} color="var(--text-muted)" />
                  </div>
                </th>
                <th>SEVERITY</th>
                <th>LOCATION</th>
                <th>CONFIDENCE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No incident reports match the selected filters.
                  </td>
                </tr>
              )}
              {filteredEvents.map(e => (
                <tr 
                  key={e._id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedEvent(e)}
                >
                  <td>
                    <span className={`badge badge-${e.severity}`}>
                      {e.category.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontWeight: '600', color: e.severity === 'critical' ? 'var(--danger-color)' : e.severity === 'high' ? 'var(--warning-color)' : 'var(--text-primary)' }}>
                    {e.severity}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                      <MapPin size={14} color="var(--accent-color)" /> {e.locationName || 'Unknown Location'}
                    </div>
                  </td>
                  <td>
                    <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {e.confidenceScore}%
                    </span>
                  </td>
                  <td>
                    <div className={`status-label ${e.status}`} style={{ 
                      fontSize: '0.72rem', 
                      textTransform: 'uppercase', 
                      padding: '0.25rem 0.65rem', 
                      background: e.status === 'approved' ? 'rgba(16, 185, 129, 0.12)' : e.status === 'dismissed' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                      borderRadius: '20px', 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: e.status === 'approved' ? '1px solid rgba(16, 185, 129, 0.3)' : e.status === 'dismissed' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {e.status === 'approved' ? <CheckCircle size={12} /> : e.status === 'dismissed' ? <XCircle size={12} /> : <Clock size={12} />}
                      {e.status}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      style={{ 
                        padding: '0.35rem 0.85rem', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(16, 185, 129, 0.4)', 
                        background: 'rgba(16, 185, 129, 0.12)', 
                        fontSize: '0.78rem', 
                        fontWeight: 700, 
                        color: 'var(--accent-color)', 
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setSelectedEvent(e);
                      }}
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
