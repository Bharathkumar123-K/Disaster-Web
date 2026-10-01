'use client';

import { Activity, Bot, TrendingUp, AlertTriangle, CheckSquare, ShieldCheck, Cpu } from 'lucide-react';
import { useDisaster } from '../../../../components/DisasterProvider';

export default function AnalyticsPage() {
  const { events, loading } = useDisaster();

  if (loading) return <div className="loading" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>Initializing Telemetry Modules...</div>;

  const total = events.length;
  const critical = events.filter(e => e.severity === 'critical').length;
  const approved = events.filter(e => e.status === 'approved').length;
  const fire = events.filter(e => e.category === 'fire').length;
  const flood = events.filter(e => e.category === 'flood').length;
  const medical = events.filter(e => e.category === 'medical').length;

  const avgConfidence = events.length > 0 ? Math.round(events.reduce((acc, curr) => acc + curr.confidenceScore, 0) / events.length) : 0;

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '2rem', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.6rem', fontWeight: 800 }}>
            <Activity size={28} color="var(--accent-color)" /> Command Telemetry & AI Analytics
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Real-time automated incident throughput, dispatch telemetry, and neural triage performance indicators.
          </p>
        </div>
        
        {/* Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          <div className="metric-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
            <div className="metric-title"><TrendingUp size={16} color="var(--accent-color)" /> Total Processed</div>
            <div className="metric-value font-mono">{total}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Signals ingested via API / Sockets</div>
          </div>
          
          <div className="metric-card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
            <div className="metric-title"><AlertTriangle size={16} color="var(--danger-color)" /> Critical Alerts</div>
            <div className="metric-value font-mono" style={{ color: 'var(--danger-color)' }}>{critical}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>High priority emergency signals</div>
          </div>
          
          <div className="metric-card" style={{ borderLeft: '4px solid var(--success-color)' }}>
            <div className="metric-title"><CheckSquare size={16} color="var(--success-color)" /> Dispatched Actions</div>
            <div className="metric-value font-mono" style={{ color: 'var(--success-color)' }}>{approved}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Operator approved units</div>
          </div>
          
          <div className="metric-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(15,23,42,0.8))', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div className="metric-title" style={{ color: '#ffffff' }}><Bot size={16} color="var(--accent-color)" /> Neural Confidence Avg</div>
            <div className="metric-value font-mono" style={{ color: 'var(--accent-color)' }}>
              {avgConfidence}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Model decision threshold accuracy</div>
          </div>

        </div>

        {/* Breakdown Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.75rem', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--glass-shadow)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--accent-color)" /> Incident Type Distribution
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Fire & Thermal Emergencies</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{fire} records ({total ? Math.round((fire/total)*100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${total ? (fire/total)*100 : 0}%`, height: '100%', background: 'var(--danger-color)', borderRadius: '4px', boxShadow: '0 0 8px var(--danger-color)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Flood & Hydrological Disasters</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{flood} records ({total ? Math.round((flood/total)*100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${total ? (flood/total)*100 : 0}%`, height: '100%', background: 'var(--medium-color)', borderRadius: '4px', boxShadow: '0 0 8px var(--medium-color)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Medical & Rescue Operations</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{medical} records ({total ? Math.round((medical/total)*100) : 0}%)</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${total ? (medical/total)*100 : 0}%`, height: '100%', background: 'var(--warning-color)', borderRadius: '4px', boxShadow: '0 0 8px var(--warning-color)' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1.75rem', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <ShieldCheck size={44} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>AI Guardrails Active</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Human-in-the-loop verification protocol enforced. All high-impact dispatches require operator sign-off before CAD integration.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
