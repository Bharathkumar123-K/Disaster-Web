'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useDisaster } from './DisasterProvider';
import { Bell, LifeBuoy, Globe, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ClientShell({ children }) {
  const { notificationToast, clearNotificationToast, setSelectedEvent } = useDisaster();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar />
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Real-time Socket Notification Toast Banner */}
      {notificationToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: notificationToast.isCitizen ? '#1e1b2e' : '#0f172a',
          border: notificationToast.isCitizen ? '1px solid #f43f5e' : '1px solid #38bdf8',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          zIndex: 3000,
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: notificationToast.isCitizen ? '#f43f5e' : '#38bdf8' }}>
              {notificationToast.isCitizen ? <LifeBuoy size={16} /> : <Globe size={16} />}
              <span>{notificationToast.title}</span>
            </div>
            <button 
              onClick={clearNotificationToast}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
            {notificationToast.location}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {notificationToast.text}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span className={`badge badge-${notificationToast.severity}`} style={{ fontSize: '0.65rem' }}>
              {notificationToast.category} · {notificationToast.severity}
            </span>

            <Link 
              href={notificationToast.isCitizen ? '/dashboard/citizen-issues' : '/dashboard/external-issues'}
              onClick={clearNotificationToast}
              style={{ fontSize: '0.75rem', fontWeight: 800, color: notificationToast.isCitizen ? '#f43f5e' : '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Open Module <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
