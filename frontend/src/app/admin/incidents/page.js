'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../../../components/admin/AdminProvider';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3, 
  AlertTriangle,
  RefreshCw,
  Layers,
  MapPin
} from 'lucide-react';

export default function AdminIncidentsPage() {
  const { incidents, fetchIncidents, showToast } = useAdmin();
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIncidents({
      status: statusFilter,
      severity: severityFilter,
      category: categoryFilter,
      search: searchTerm
    });
  }, [statusFilter, severityFilter, categoryFilter, searchTerm, fetchIncidents]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(incidents.map(inc => inc._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to perform bulk '${action.toUpperCase()}' on ${selectedIds.length} incidents?`)) return;

    try {
      const res = await fetch('http://localhost:5000/api/admin/incidents/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds: selectedIds, action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Bulk ${action.toUpperCase()} completed for ${selectedIds.length} items`);
        setSelectedIds([]);
        fetchIncidents();
      }
    } catch (e) {
      showToast('Bulk action failed', 'error');
    }
  };

  const handleSingleStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Incident status updated to ${newStatus}`);
        fetchIncidents();
      }
    } catch (e) {
      showToast('Failed to update incident', 'error');
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!confirm('Permanently delete this incident record from master database?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/incidents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Incident purged');
        fetchIncidents();
      }
    } catch (e) {
      showToast('Failed to delete incident', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Master Incident Oversight & Purge</span>
            <span className="admin-badge">DATABASE OVERRIDE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Filter, edit, bulk approve/dismiss, or permanently purge incident telemetry across all Indian sectors.
          </p>
        </div>
      </div>

      {/* Filter & Bulk Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search location or text description..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Select Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            <select className="form-select" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">All Categories</option>
              <option value="flood">Flood</option>
              <option value="cyclone">Cyclone</option>
              <option value="fire">Fire</option>
              <option value="collapse">Collapse</option>
              <option value="roadblock">Roadblock</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
              {selectedIds.length} incidents selected
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleBulkAction('approve')} className="btn btn-approve" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                <CheckCircle size={14} /> Bulk Approve
              </button>
              <button onClick={() => handleBulkAction('dismiss')} className="btn btn-dismiss" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                <XCircle size={14} /> Bulk Dismiss
              </button>
              <button onClick={() => handleBulkAction('delete')} className="btn" style={{ background: '#f43f5e', color: '#ffffff', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                <Trash2 size={14} /> Bulk Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Incidents Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedIds.length === incidents.length && incidents.length > 0} 
                  />
                </th>
                <th>Location & Category</th>
                <th>Severity</th>
                <th>Confidence</th>
                <th>People Affected</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((event) => (
                <tr key={event._id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(event._id)} 
                      onChange={() => handleToggleSelect(event._id)} 
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#f59e0b" /> {event.locationName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {event.text.length > 80 ? `${event.text.substring(0, 80)}...` : event.text}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${event.severity || 'low'}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                    {event.confidenceScore}%
                  </td>
                  <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {event.peopleAffected}
                  </td>
                  <td>
                    <select 
                      value={event.status} 
                      onChange={e => handleSingleStatus(event._id, e.target.value)}
                      style={{
                        background: event.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : event.status === 'dismissed' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: event.status === 'approved' ? '#10b981' : event.status === 'dismissed' ? '#f43f5e' : '#f59e0b',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending" style={{ background: '#0f172a', color: '#f59e0b' }}>Pending</option>
                      <option value="approved" style={{ background: '#0f172a', color: '#10b981' }}>Approved</option>
                      <option value="dismissed" style={{ background: '#0f172a', color: '#f43f5e' }}>Dismissed</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDeleteSingle(event._id)} 
                      title="Purge Incident"
                      style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '0.35rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
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
