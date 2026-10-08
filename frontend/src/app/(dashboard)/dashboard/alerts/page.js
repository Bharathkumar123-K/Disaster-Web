'use client';

import { useState } from 'react';
import { Bell, AlertTriangle, Radio, ShieldCheck, MapPin } from 'lucide-react';
import { useDisaster } from '../../../../components/DisasterProvider';

export default function LiveAlertsPage() {
  const { events, loading } = useDisaster();

  if (loading) {
    return (
      <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
        <p style={{ fontWeight: 700, color: 'var(--accent-color)' }}>Loading Regional Emergency Alerts Broadcast...</p>
      </div>
    );
  }

  const activeAlerts = events.filter(e => e.severity === 'critical' || e.severity === 'high');

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <Bell size={22} color="#f59e0b" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              📡 Regional Emergency Broadcast Alerts
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '720px' }}>
            High-priority disaster warnings and emergency notifications dispatched across Indian state cell broadcast systems.
          </p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '0.65rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Active Broadcasts</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }} className="font-mono">{activeAlerts.length}</div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {activeAlerts.map(alert => (
          <div 
            key={alert._id}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span className={`badge badge-${alert.severity}`}>
                  {alert.category ? alert.category.toUpperCase() : 'ALERT'} — {alert.severity}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="font-mono">
                  {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
                {alert.locationName}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                {alert.text}
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="var(--accent-color)" /> {alert.locationName}
              </span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }} className="font-mono">
                {alert.confidenceScore}% CONFIDENCE
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
