'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bot, 
  Zap, 
  MapPin, 
  Activity, 
  Settings, 
  X, 
  Users, 
  Navigation,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useDisaster } from './DisasterProvider';
import ReliefFundPanel from './ReliefFundPanel';

// Dynamic import for Leaflet Map
const DisasterMap = dynamic(() => import('./Map'), { 
  ssr: false, 
  loading: () => <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initializing Tactical Geo-Engine...</div> 
});

export default function Dashboard({ currentView }) {
  const { 
    events, 
    loading, 
    handleAction, 
    getRecommendation, 
    searchQuery, 
    selectedEvent, 
    setSelectedEvent 
  } = useDisaster();

  if (loading) return <div className="loading">Initializing Mission Command Center...</div>;

  // Filter events by search query if present
  const filteredEvents = events.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.locationName && e.locationName.toLowerCase().includes(q)) ||
      (e.severity && e.severity.toLowerCase().includes(q)) ||
      (e.text && e.text.toLowerCase().includes(q))
    );
  });

  // Views: Map, Reports, Analytics, Settings
  if (currentView === 'map') {
    return (
      <div className="glass-panel" style={{ height: '100%', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
          <MapPin size={22} color="var(--accent-color)" /> Geocoded Tactical Situation Map
        </h2>
        <div style={{ flex: 1, borderRadius: '14px', overflow: 'hidden' }}>
          <DisasterMap events={events} />
        </div>
      </div>
    );
  }

  if (currentView === 'reports') {
    return (
      <div className="glass-panel" style={{ height: '100%', padding: '2rem', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} color="var(--accent-color)" /> Master Incident Reports Database
        </h2>
        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Confidence</th>
                <th>People Affected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e._id}>
                  <td><span className={`badge badge-${e.severity}`}>{e.category.toUpperCase()}</span></td>
                  <td style={{ textTransform: 'capitalize', fontWeight: 700 }}>{e.severity}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{e.locationName || 'Unknown Sector'}</td>
                  <td className="font-mono" style={{ color: '#38bdf8' }}>{e.confidenceScore}%</td>
                  <td className="font-mono">{e.peopleAffected}</td>
                  <td>
                    <span className={`status-label ${e.status}`}>
                      {e.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (currentView === 'analytics') {
    const total = events.length;
    const critical = events.filter(e => e.severity === 'critical').length;
    const approved = events.filter(e => e.status === 'approved').length;
    const fire = events.filter(e => e.category === 'fire').length;
    const flood = events.filter(e => e.category === 'flood').length;
    const medical = events.filter(e => e.category === 'medical').length;

    return (
      <div className="glass-panel" style={{ height: '100%', padding: '2rem', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={22} color="var(--accent-color)" /> Telemetry Analytics & Distribution
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="metric-card">
            <div className="metric-title">Total Active Telemetry</div>
            <div className="metric-value font-mono">{total}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title" style={{ color: '#f43f5e' }}>Critical Level Emergencies</div>
            <div className="metric-value font-mono" style={{ color: '#f43f5e' }}>{critical}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title" style={{ color: '#10b981' }}>Dispatched Actions</div>
            <div className="metric-value font-mono" style={{ color: '#10b981' }}>{approved}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Incident Category Distribution</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                <span>Fire & Hazmat</span><span>{fire}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (fire/total)*100 : 0}%`, height: '100%', background: '#f43f5e' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                <span>Flood & Inundation</span><span>{flood}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (flood/total)*100 : 0}%`, height: '100%', background: '#10b981' }} />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <Bot size={40} color="var(--accent-color)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem' }}>AI NLP Confidence Average</h4>
            <p className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)', marginTop: '0.25rem' }}>
              {events.length > 0 ? Math.round(events.reduce((acc, curr) => acc + curr.confidenceScore, 0) / events.length) : 0}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: Clean 2-Section Grid (Map Section + Dedicated Side Inspector Section)
  return (
    <div className="dashboard-grid">
      {/* SECTION 1: Tactical Map (Always 100% Unobscured) */}
      <div className="map-section">
        <div className="feed-header-title" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          <MapPin size={18} color="var(--accent-color)" /> Tactical Geocoded Map
        </div>
        <div className="map-container">
          <DisasterMap events={filteredEvents} />
        </div>
      </div>

      {/* SECTION 2: Dedicated Side Dock (Incident Feed or Selected Inspector) */}
      <div className="feed-section">
        {selectedEvent ? (
          /* DEDICATED INCIDENT INSPECTOR PANEL (NO OVERLAY ON MAP) */
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <button 
                onClick={() => setSelectedEvent(null)} 
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: '#ffffff', padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <ArrowLeft size={16} /> Back to Live Feed
              </button>
              <span className={`badge badge-${selectedEvent.severity}`}>
                {selectedEvent.severity}
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                {selectedEvent.locationName}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {selectedEvent.text}
              </p>
            </div>

            {/* Incident Telemetry Details Box */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Disaster Category:</span>
                <strong style={{ color: '#ffffff', textTransform: 'uppercase' }}>{selectedEvent.category}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>AI Confidence Score:</span>
                <strong style={{ color: '#38bdf8' }} className="font-mono">{selectedEvent.confidenceScore}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Victims:</span>
                <strong style={{ color: '#ffffff' }} className="font-mono">{selectedEvent.peopleAffected} citizens</strong>
              </div>
            </div>

            {/* AI Department Recommendation Box */}
            {getRecommendation(selectedEvent._id) && (
              <div className="premium-rec-box" style={{ marginBottom: '1rem' }}>
                <div className="premium-rec-title">
                  <Bot size={16} color="var(--accent-color)" /> AI Dispatch Recommendation
                </div>
                <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 700, marginTop: '0.2rem' }}>
                  Deploy {getRecommendation(selectedEvent._id).suggestedDepartment} ({getRecommendation(selectedEvent._id).priorityLevel.toUpperCase()})
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Resources: {getRecommendation(selectedEvent._id).suggestedResources.join(', ')}
                </div>
              </div>
            )}

            {/* Support Relief Efforts Panel */}
            <ReliefFundPanel locationName={selectedEvent.locationName} compact={true} />

            {/* Action Buttons */}
            {selectedEvent.status === 'pending' ? (
              <div className="action-buttons" style={{ marginTop: 'auto' }}>
                <button className="btn btn-approve" onClick={() => handleAction(selectedEvent._id, 'approve')}>
                  <CheckCircle size={16} /> Approve & Dispatch
                </button>
                <button className="btn btn-dismiss" onClick={() => handleAction(selectedEvent._id, 'dismiss')}>
                  <XCircle size={16} /> Dismiss Report
                </button>
              </div>
            ) : (
              <div className={`status-label ${selectedEvent.status}`} style={{ marginTop: 'auto', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', justifyContent: 'center' }}>
                <CheckCircle size={18} /> STATUS: {selectedEvent.status.toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          /* STANDARD INCIDENT FEED PANEL */
          <>
            <div className="feed-header-title">
              <AlertTriangle size={18} color="var(--warning-color)" /> 
              <span>Live Triage Signals ({filteredEvents.length})</span>
            </div>
            
            <div className="feed-list">
              {filteredEvents.length === 0 && (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <p style={{ fontWeight: 700, color: '#ffffff' }}>No matching signals found</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Adjust search query or filter tags.</p>
                </div>
              )}
              
              {filteredEvents.map(event => {
                const rec = getRecommendation(event._id);
                const isPending = event.status === 'pending';

                return (
                  <div 
                    key={event._id} 
                    className={`feed-item ${event.severity}`}
                    onClick={() => setSelectedEvent(event)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="feed-header">
                      <span className={`badge badge-${event.severity}`}>
                        {event.category} - {event.severity}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }} className="font-mono">
                        {event.confidenceScore}% CONFIDENCE
                      </span>
                    </div>
                    
                    <p className="feed-text">{event.text && event.text.substring(0, 130)}...</p>
                    <div className="feed-meta">
                      <MapPin size={14} /> {event.locationName || 'Unknown Sector'}
                    </div>
                    
                    {rec && (
                      <div className="premium-rec-box">
                        <div className="premium-rec-title">
                          <Bot size={14} color="var(--accent-color)" /> {rec.suggestedDepartment} ({rec.priorityLevel})
                        </div>
                      </div>
                    )}

                    {isPending ? (
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-approve" onClick={() => handleAction(event._id, 'approve')}>
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button className="btn btn-dismiss" onClick={() => handleAction(event._id, 'dismiss')}>
                          <XCircle size={16} /> Dismiss
                        </button>
                      </div>
                    ) : (
                      <div className={`status-label ${event.status}`}>
                        <CheckCircle size={16} /> {event.status.toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
