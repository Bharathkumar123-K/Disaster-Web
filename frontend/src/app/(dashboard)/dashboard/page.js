'use client';

import dynamic from 'next/dynamic';
import { AlertTriangle, CheckCircle, XCircle, Bot, MapPin, Radio, Flame, Waves, Ambulance, ShieldAlert } from 'lucide-react';
import { useDisaster } from '../../../components/DisasterProvider';

const DisasterMap = dynamic(() => import('../../../components/Map'), { ssr: false, loading: () => <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>Initializing Tactical Geo-Engine...</div> });

export default function DashboardPage() {
  const { events, loading, handleAction, getRecommendation, searchQuery, setSearchQuery } = useDisaster();

  if (loading) return <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 600 }}>Initializing Control Room Telemetry...</div>;

  const filteredEvents = events.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.severity && e.severity.toLowerCase().includes(q)) ||
      (e.locationName && e.locationName.toLowerCase().includes(q)) ||
      (e.text && e.text.toLowerCase().includes(q)) ||
      (e.status && e.status.toLowerCase().includes(q))
    );
  });

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'fire': return <Flame size={14} />;
      case 'flood': return <Waves size={14} />;
      case 'medical': return <Ambulance size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Map Section */}
      <div className="map-section">
        <div className="feed-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--accent-color)" /> Global Tactical Situation Map
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="font-mono">
            {filteredEvents.length} ACTIVE SIGNALS
          </span>
        </div>
        <div className="map-container">
          <DisasterMap events={filteredEvents} />
        </div>
      </div>

      {/* Incident Feed Section */}
      <div className="feed-section">
        <div className="feed-header-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Radio size={18} color="var(--warning-color)" className="animate-pulse" /> 
            <span>Live Incident Feed & AI Triage</span>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.72rem', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
            >
              Clear ("{searchQuery}")
            </button>
          )}
        </div>
        
        <div className="feed-list">
          {filteredEvents.length === 0 && (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <ShieldAlert size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                {searchQuery ? `No signals match "${searchQuery}"` : 'Awaiting Incoming Incident Signals...'}
              </p>
            </div>
          )}
          
          {filteredEvents.map(event => {
            const rec = getRecommendation(event._id);
            const isPending = event.status === 'pending';

            return (
              <div key={event._id} className={`feed-item ${event.severity}`}>
                <div className="feed-header">
                  <span className={`badge badge-${event.severity}`}>
                    {getCategoryIcon(event.category)}
                    {event.category} · {event.severity}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }} className="font-mono">
                    CONFIDENCE: <span style={{ color: 'var(--text-primary)' }}>{event.confidenceScore}%</span>
                  </span>
                </div>
                
                <p className="feed-text">
                  {event.text && event.text.substring(0, 140)}...
                </p>
                
                <div className="feed-meta">
                  <MapPin size={14} color="var(--accent-color)" /> 
                  <span>{event.locationName || 'Location Unknown'}</span>
                </div>
                
                {/* AI Dispatch Recommendation Panel */}
                {rec && (
                  <div className="premium-rec-box">
                    <div className="premium-rec-title">
                      <Bot size={16} color="var(--accent-color)" /> AI Dispatch Recommendation
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                      Suggested Unit: <strong style={{ color: '#ffffff' }}>{rec.suggestedDepartment}</strong> ({rec.priorityLevel})<br/>
                      Required Resources: <span style={{ color: 'var(--text-primary)' }}>{rec.suggestedResources.join(', ')}</span>
                    </div>
                  </div>
                )}

                {isPending ? (
                  <div className="action-buttons">
                    <button className="btn btn-approve" onClick={() => handleAction(event._id, 'approve')}>
                      <CheckCircle size={16} /> Approve Dispatch
                    </button>
                    <button className="btn btn-dismiss" onClick={() => handleAction(event._id, 'dismiss')}>
                      <XCircle size={16} /> Dismiss
                    </button>
                  </div>
                ) : (
                  <div className={`status-label ${event.status}`} style={{
                    marginTop: '0.75rem',
                    padding: '0.6rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    justify: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    {event.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    ACTION {event.status.toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
