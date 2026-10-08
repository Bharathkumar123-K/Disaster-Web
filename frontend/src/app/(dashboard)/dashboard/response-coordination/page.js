'use client';

import { useState } from 'react';
import { 
  Truck, 
  CheckCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  LifeBuoy, 
  Globe, 
  User, 
  Phone,
  Eye
} from 'lucide-react';
import { useDisaster } from '../../../../components/DisasterProvider';
import IncidentDetailModal from '../../../../components/IncidentDetailModal';

export default function ResponseCoordinationPage() {
  const { events, loading, updateEventDetails } = useDisaster();
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (loading) {
    return (
      <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
        <p style={{ fontWeight: 700, color: 'var(--accent-color)' }}>Loading Response & Resource Coordination Hub...</p>
      </div>
    );
  }

  // Active dispatches (approved or response_assigned)
  const activeDispatches = events.filter(e => e.status === 'approved' || e.status === 'response_assigned');
  const resolvedDispatches = events.filter(e => e.status === 'resolved');

  const handleResolve = async (eventId) => {
    await updateEventDetails(eventId, { status: 'resolved' });
  };

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <Truck size={22} color="var(--accent-color)" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              🚒 Response & Resource Coordination Hub
            </h2>
            <span style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '12px' }}>
              UNIFIED DISPATCH PIPELINE
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '720px' }}>
            Central command system coordinating tactical NDRF/SDRF units, Fire tenders, and 108 Ambulances across both Citizen SOS and External Telemetry incidents.
          </p>
        </div>

        {/* Counters */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase' }}>Active Dispatches</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-color)' }} className="font-mono">{activeDispatches.length}</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Resolved Incidents</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }} className="font-mono">{resolvedDispatches.length}</div>
          </div>
        </div>
      </div>

      {/* Dispatches Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <ShieldCheck size={18} color="var(--accent-color)" /> Active Response Operations ({activeDispatches.length})
        </h3>

        {activeDispatches.length === 0 ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>No Active Dispatches awaiting resolution</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Approve pending reports from Citizen Issues or External Signals to trigger resource assignment.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
            {activeDispatches.map(event => {
              const isCitizen = event.sourceType === 'CITIZEN' || event.sourceType === 'CITIZEN_REPORT' || event.sourceType === 'CITIZEN_PORTAL';

              return (
                <div 
                  key={event._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: isCitizen ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span style={{ 
                        background: isCitizen ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)', 
                        color: isCitizen ? '#f43f5e' : '#38bdf8', 
                        border: isCitizen ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)', 
                        fontSize: '0.68rem', 
                        fontWeight: 800, 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isCitizen ? <LifeBuoy size={12} /> : <Globe size={12} />}
                        {isCitizen ? 'Citizen SOS' : (event.sourceType || 'External Feed')}
                      </span>

                      <span className={`badge badge-${event.severity}`}>
                        {event.priorityLevel ? event.priorityLevel.toUpperCase() : 'URGENT'} PRIORITY
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
                      {event.locationName || 'Unknown Location'}
                    </h4>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.text}
                    </p>

                    {/* Assigned Response Team Box */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.65rem 0.85rem', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      <div style={{ color: 'var(--accent-color)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={14} /> Assigned Team: {event.assignedTeam || 'NDRF / SDRF Regional Battalion'}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Eye size={14} /> View Details
                    </button>

                    <button
                      onClick={() => handleResolve(event._id)}
                      style={{ padding: '0.45rem 0.95rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#ffffff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle size={14} /> Mark as Resolved
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedEvent && (
        <IncidentDetailModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

    </div>
  );
}
