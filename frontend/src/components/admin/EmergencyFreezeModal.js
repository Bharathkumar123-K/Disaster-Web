'use client';

import { useState } from 'react';
import { useAdmin } from './AdminProvider';
import { X, Power, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

export default function EmergencyFreezeModal() {
  const { isFreezeModalOpen, setIsFreezeModalOpen, showToast } = useAdmin();
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isFreezeModalOpen) return null;

  const handleFreeze = (e) => {
    e.preventDefault();
    if (pin !== '0000' && pin !== '9999') {
      showToast('Invalid Root Security PIN (Try 0000 or 9999)', 'error');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsFreezeModalOpen(false);
      showToast('EMERGENCY PROTOCOL ENGAGED: Ingestion Pipelines Locked & Freeze Signal Broadcast!', 'error');
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ border: '1px solid rgba(244, 63, 94, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(244, 63, 94, 0.2)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <AlertTriangle size={22} color="#f43f5e" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f43f5e' }}>Emergency System Freeze Protocol</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Level 0 Master Lockout & Ingestion Freeze</p>
            </div>
          </div>
          <button onClick={() => setIsFreezeModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '10px', padding: '1rem', fontSize: '0.85rem', color: '#fca5a5', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          <strong>WARNING:</strong> Engaging this protocol will temporarily pause all automated AI intake streams, lock active dispatch updates, and set the platform to Read-Only emergency state.
        </div>

        <form onSubmit={handleFreeze}>
          <div className="form-group">
            <label className="form-label">Superuser Verification PIN</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter PIN (Default: 0000)" 
              value={pin}
              onChange={e => setPin(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={() => setIsFreezeModalOpen(false)}
              className="btn btn-dismiss"
            >
              Abort Protocol
            </button>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="btn"
              style={{ flex: 2, background: '#f43f5e', color: '#ffffff', fontWeight: 700 }}
            >
              <Power size={16} />
              {isProcessing ? 'Engaging Freeze...' : 'Engage Emergency Freeze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
