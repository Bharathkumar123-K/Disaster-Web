'use client';

import dynamic from 'next/dynamic';
import { MapPin, Globe, Radio } from 'lucide-react';
import { useDisaster } from '../../../../components/DisasterProvider';

const DisasterMap = dynamic(() => import('../../../../components/Map'), { ssr: false, loading: () => <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>Initializing Tactical Geo-Engine...</div> });

export default function MapPage() {
  const { events, loading } = useDisaster();

  if (loading) return <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontWeight: 600 }}>Initializing Control Room Modules...</div>;

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={22} color="var(--accent-color)" /> 
          Global Tactical Situation Map
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} color="var(--accent-color)" className="animate-pulse" />
            LIVE TELEMETRY FEED
          </span>
          <span className="font-mono" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: 700, color: '#fff' }}>
            {events.length} SIGNALS LOCATED
          </span>
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--glass-shadow)', position: 'relative' }}>
        <DisasterMap events={events} />
      </div>
    </div>
  );
}
