'use client';

import { useState } from 'react';
import { Settings, CheckCircle, Sliders, Shield, Radio, Bell, Save } from 'lucide-react';

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(75);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '2rem', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.6rem', fontWeight: 800 }}>
            <Settings size={28} color="var(--accent-color)" /> Command Center Configuration
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Configure neural triage thresholds, dispatch logic automation, and external agency CAD integrations.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
          
          {/* AI Configuration */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.75rem', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--glass-shadow)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--accent-color)" /> Automation & Threshold Logic
            </h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                AI Confidence Cutoff <span className="font-mono" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{threshold}%</span>
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                Events below this confidence threshold will be flagged for manual operator triage before dispatch.
              </p>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={threshold} 
                onChange={(e) => setThreshold(e.target.value)}
                className="custom-range" 
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.65rem', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>Dispatch Control Protocol</label>
              <select className="custom-select" style={{ background: '#0b0f19', color: '#ffffff', borderColor: 'rgba(255,255,255,0.12)' }}>
                <option>Human-In-The-Loop (Require Operator Sign-Off)</option>
                <option>Autonomous Dispatch (Critical Severity Only)</option>
                <option>Monitor & Telemetry Logging Only</option>
              </select>
            </div>
          </div>

          {/* Notifications & Integrations */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.75rem', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--glass-shadow)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="var(--accent-color)" /> Agency Integration Webhooks
            </h3>
            
            {[
              { name: 'Fire Department CAD API', desc: 'Direct webhook push to 911 dispatch', active: true },
              { name: 'State Law Enforcement CAD', desc: 'Real-time sync with regional units', active: true },
              { name: 'Emergency SMS Broadcast', desc: 'Field volunteer alert via Twilio', active: false },
              { name: 'Executive Operations Digest', desc: 'Hourly automated summary digest', active: true },
            ].map((channel, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'space-between', 
                marginBottom: '0.85rem', 
                padding: '0.85rem 1rem', 
                background: channel.active ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)', 
                borderRadius: '10px', 
                border: '1px solid', 
                borderColor: channel.active ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)' 
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '2px' }}>{channel.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{channel.desc}</div>
                </div>
                <div style={{ 
                  width: '40px', height: '22px', borderRadius: '11px', 
                  background: channel.active ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.15)', 
                  position: 'relative', cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}>
                  <div style={{ 
                    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px', left: channel.active ? '20px' : '2px',
                    transition: 'left 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>

        </div>
        
        {/* Save Bar */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {saved && (
            <span style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={16} /> Configuration Saved Successfully!
            </span>
          )}
          <button 
            onClick={handleSave}
            className="btn-approve" 
            style={{ 
              padding: '0.85rem 2.25rem', 
              borderRadius: '10px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '0.92rem', 
              boxShadow: '0 4px 15px rgba(16,185,129,0.3)' 
            }}
          >
            <Save size={18} /> Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
