'use client';

import { useAdmin } from '../../../components/admin/AdminProvider';
import { 
  Radio, 
  Rss, 
  PhoneCall, 
  CloudLightning, 
  PlusCircle, 
  CheckCircle, 
  PauseCircle, 
  Zap, 
  Send,
  Layers
} from 'lucide-react';

export default function AdminIngestionPage() {
  const { overview, toggleFeed, setIsInjectModalOpen } = useAdmin();
  const feeds = overview?.feeds || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Data Stream & Ingestion Control</span>
            <span className="admin-badge">REAL-TIME FEEDS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Monitor and toggle social sentiment intake, RSS feeds, hotline APIs, and radar telemetry.
          </p>
        </div>
        <button 
          onClick={() => setIsInjectModalOpen(true)} 
          className="btn btn-approve"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff' }}
        >
          <PlusCircle size={16} />
          Inject Test Payload
        </button>
      </div>

      {/* Stream Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Twitter Stream */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <Radio size={22} color="#38bdf8" />
              </div>
              <span className={`badge ${feeds.twitterStream ? 'badge-low' : 'badge-critical'}`}>
                {feeds.twitterStream ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>Twitter / X API Stream</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              Filters geotagged posts across India using custom keyword alert matrices and sentiment confidence scoring.
            </p>
          </div>
          <div className="switch-label">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: feeds.twitterStream ? '#10b981' : 'var(--text-muted)' }}>
              Stream Status: {feeds.twitterStream ? 'ON (10s Cycle)' : 'PAUSED'}
            </span>
            <input 
              type="checkbox" 
              className="switch-input" 
              checked={!!feeds.twitterStream} 
              onChange={(e) => toggleFeed('twitterStream', e.target.checked)} 
            />
          </div>
        </div>

        {/* News RSS Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Rss size={22} color="#f59e0b" />
              </div>
              <span className={`badge ${feeds.rssNews ? 'badge-low' : 'badge-critical'}`}>
                {feeds.rssNews ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>News RSS & Wire Feeds</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              Aggregates official press bulletins from NDMA, PIB Disaster Cell, and ReliefWeb international wires.
            </p>
          </div>
          <div className="switch-label">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: feeds.rssNews ? '#10b981' : 'var(--text-muted)' }}>
              Stream Status: {feeds.rssNews ? 'ON (15m Cycle)' : 'PAUSED'}
            </span>
            <input 
              type="checkbox" 
              className="switch-input" 
              checked={!!feeds.rssNews} 
              onChange={(e) => toggleFeed('rssNews', e.target.checked)} 
            />
          </div>
        </div>

        {/* Emergency Hotline 112 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                <PhoneCall size={22} color="#f43f5e" />
              </div>
              <span className={`badge ${feeds.emergencyHotline ? 'badge-low' : 'badge-critical'}`}>
                {feeds.emergencyHotline ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>Emergency Hotline 112 Intake</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              Direct telephony integration receiving verified distress calls from emergency call dispatch centers.
            </p>
          </div>
          <div className="switch-label">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: feeds.emergencyHotline ? '#10b981' : 'var(--text-muted)' }}>
              Stream Status: {feeds.emergencyHotline ? 'ON (Live Push)' : 'PAUSED'}
            </span>
            <input 
              type="checkbox" 
              className="switch-input" 
              checked={!!feeds.emergencyHotline} 
              onChange={(e) => toggleFeed('emergencyHotline', e.target.checked)} 
            />
          </div>
        </div>

        {/* Weather Radar API */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CloudLightning size={22} color="#10b981" />
              </div>
              <span className={`badge ${feeds.radarWeather ? 'badge-low' : 'badge-critical'}`}>
                {feeds.radarWeather ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>IMD Weather & Seismic Radar</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
              India Meteorological Department cyclone alerts, rainfall intensity gauges, and USGS seismic feeds.
            </p>
          </div>
          <div className="switch-label">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: feeds.radarWeather ? '#10b981' : 'var(--text-muted)' }}>
              Stream Status: {feeds.radarWeather ? 'ON (30s Cycle)' : 'PAUSED'}
            </span>
            <input 
              type="checkbox" 
              className="switch-input" 
              checked={!!feeds.radarWeather} 
              onChange={(e) => toggleFeed('radarWeather', e.target.checked)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
