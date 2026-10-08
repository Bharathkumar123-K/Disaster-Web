'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminProvider';
import { 
  ShieldCheck, 
  Radio, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  User, 
  CheckCircle,
  PlusCircle,
  Power,
  LogOut
} from 'lucide-react';

export default function AdminTopBar() {
  const router = useRouter();
  const { 
    overview, 
    loading, 
    refreshAll, 
    toastMessage, 
    setIsInjectModalOpen, 
    setIsFreezeModalOpen 
  } = useAdmin();

  // Dynamic logged-in user profile session
  const [userSession, setUserSession] = useState({
    name: 'Cmdr. Rajesh Sharma',
    email: 'admin@nexuscommand.org',
    badge: 'DIR-ROOT-CLEARANCE-0'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexus_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name) {
            setUserSession(parsed);
          }
        } catch (err) {
          console.error('Failed to parse logged in user session:', err);
        }
      }
    }
  }, []);

  const getInitials = (nameStr) => {
    if (!nameStr) return 'AD';
    const cleanName = nameStr.replace(/^(Dr\.|Cmdr\.|Director|Officer|Operator)\s+/i, '').trim();
    const parts = cleanName.split(' ').filter(Boolean);
    if (parts.length === 0) return 'AD';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexus_user');
    }
    router.push('/login');
  };

  return (
    <header className="topbar" style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(9, 13, 22, 0.95)' }}>
      {/* Left Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.4rem 0.85rem', borderRadius: '20px' }}>
          <ShieldCheck size={16} color="#f59e0b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>
            ROOT CLEARANCE LEVEL 0
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Radio size={14} color="var(--accent-color)" />
          <span>Ingestion Feeds:</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>ONLINE</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="topbar-right">
        {/* Test Injection Button */}
        <button 
          onClick={() => setIsInjectModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            transition: 'all 0.2s'
          }}
        >
          <PlusCircle size={16} />
          <span>Inject Incident</span>
        </button>

        {/* Emergency Freeze Button */}
        <button 
          onClick={() => setIsFreezeModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#f43f5e',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Power size={16} />
          <span>Emergency Freeze</span>
        </button>

        {/* Refresh Button */}
        <button 
          onClick={refreshAll}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin-slow' : ''} />
        </button>

        {/* Dynamic Admin Profile from Login Session */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '0.85rem' }}>
            {getInitials(userSession.name)}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{userSession.name}</div>
            <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 600 }}>{userSession.badge || 'Chief System Director'}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          title="Logout of Admin Command Portal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#f43f5e',
            padding: '0.5rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginLeft: '0.25rem',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: toastMessage.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.88rem',
          fontWeight: 700,
          zIndex: 2000,
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          {toastMessage.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </header>
  );
}
