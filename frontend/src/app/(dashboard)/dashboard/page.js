'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bot, 
  MapPin, 
  Radio, 
  LifeBuoy, 
  Globe, 
  Eye, 
  Truck, 
  ShieldAlert, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useDisaster } from '../../../components/DisasterProvider';
import IncidentDetailModal from '../../../components/IncidentDetailModal';

const DisasterMap = dynamic(() => import('../../../components/Map'), { 
  ssr: false, 
  loading: () => <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>Initializing Geo-Engine...</div> 
});

export default function OperationsDashboardPage() {
  const { citizenEvents, externalEvents, loading, handleAction, getRecommendation, selectedEvent, setSelectedEvent } = useDisaster();
  const [modalEvent, setModalEvent] = useState(null);

  if (loading) {
    return (
      <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 600 }}>
        Initializing NEXUS Disaster Command Operations...
      </div>
    );
  }

  const pendingCitizen = citizenEvents.filter(e => e.status === 'pending');
  const pendingExternal = externalEvents.filter(e => e.status === 'pending');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', padding: '0.25rem' }}>
      
      {/* Module Overview Cards Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
        
        {/* Module Card 1: Citizen Issues */}
        <Link 
          href="/dashboard/citizen-issues"
          style={{
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '16px',
            padding: '1.25rem',
            textDecoration: 'none',
            color: '#ffffff',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(244, 63, 94, 0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LifeBuoy size={14} /> Module 1
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              🆘 Citizen Issues ({citizenEvents.length})
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {pendingCitizen.length} pending review from public SOS
            </div>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
            <ArrowRight size={18} color="#f43f5e" />
          </div>
        </Link>

        {/* Module Card 2: External & AI Issues */}
        <Link 
          href="/dashboard/external-issues"
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '16px',
            padding: '1.25rem',
            textDecoration: 'none',
            color: '#ffffff',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(56, 189, 248, 0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={14} /> Module 2
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              🌐 External & AI Signals ({externalEvents.length})
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {pendingExternal.length} pending verification from APIs/Sensors
            </div>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
            <ArrowRight size={18} color="#38bdf8" />
          </div>
        </Link>

        {/* Module Card 3: Response & Resources */}
        <Link 
          href="/dashboard/response-coordination"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            padding: '1.25rem',
            textDecoration: 'none',
            color: '#ffffff',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Truck size={14} /> Unified Pipeline
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              🚒 Response & Resources
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Unified NDRF / SDRF / Fire unit dispatches
            </div>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <ArrowRight size={18} color="var(--accent-color)" />
          </div>
        </Link>

      </div>

      {/* Main 2-Section Grid (Map + Split Module Feeds) */}
      <div className="dashboard-grid" style={{ minHeight: '580px' }}>
        
        {/* Left: Geocoded Tactical Map */}
        <div className="map-section">
          <div className="feed-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-color)" /> Geocoded Tactical Map
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="font-mono">
              {citizenEvents.length + externalEvents.length} GEOLOCATED INCIDENTS
            </span>
          </div>
          <div className="map-container">
            <DisasterMap events={[...citizenEvents, ...externalEvents]} />
          </div>
        </div>

        {/* Right: Dual Incident Triage Column */}
        <div className="feed-section" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={16} color="var(--warning-color)" className="animate-pulse" /> Live Operational Intake
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time Socket.IO Sync</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
            
            {/* Column 1: Citizen Issues Quick List */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '0.75rem', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f43f5e', borderBottom: '1px solid rgba(244, 63, 94, 0.2)', paddingBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🆘 Citizen SOS ({citizenEvents.length})</span>
                <Link href="/dashboard/citizen-issues" style={{ color: '#f43f5e', fontSize: '0.7rem', textDecoration: 'none' }}>View All →</Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto', maxHeight: '440px' }}>
                {citizenEvents.slice(0, 8).map(event => (
                  <div key={event._id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className={`badge badge-${event.severity}`} style={{ fontSize: '0.62rem' }}>
                        {event.category ? event.category.toUpperCase() : 'SOS'}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }} className="font-mono">
                        {event.confidenceScore}%
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                      {event.locationName}
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.text}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: event.status === 'approved' ? 'var(--success-color)' : '#f59e0b', fontWeight: 700 }}>
                        {event.status.toUpperCase()}
                      </span>
                      <button 
                        onClick={() => setModalEvent(event)}
                        style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: External & AI Issues Quick List */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', borderBottom: '1px solid rgba(56, 189, 248, 0.2)', paddingBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🌐 External & AI Feeds ({externalEvents.length})</span>
                <Link href="/dashboard/external-issues" style={{ color: '#38bdf8', fontSize: '0.7rem', textDecoration: 'none' }}>View All →</Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto', maxHeight: '440px' }}>
                {externalEvents.slice(0, 8).map(event => (
                  <div key={event._id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '0.15rem 0.4rem', borderRadius: '6px' }}>
                        {event.sourceType || 'EXTERNAL'}
                      </span>
                      <span className={`badge badge-${event.severity}`} style={{ fontSize: '0.62rem' }}>
                        {event.severity}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                      {event.locationName}
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.text}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: event.status === 'approved' ? 'var(--success-color)' : '#f59e0b', fontWeight: 700 }}>
                        {event.status.toUpperCase()}
                      </span>
                      <button 
                        onClick={() => setModalEvent(event)}
                        style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Shared Details Modal */}
      {modalEvent && (
        <IncidentDetailModal 
          event={modalEvent} 
          onClose={() => setModalEvent(null)} 
        />
      )}

    </div>
  );
}
