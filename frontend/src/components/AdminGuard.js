'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexus_user');
      let currentRole = null;
      let accountType = null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          currentRole = (parsed?.role || '').toLowerCase();
          accountType = (parsed?.accountType || '').toLowerCase();
        } catch (e) {
          console.error('Failed to parse user session in AdminGuard:', e);
        }
      }

      // If user is not an Admin (e.g. operator or citizen), deny access and redirect to Operator Dashboard
      if (currentRole !== 'admin' && accountType !== 'admin') {
        setAuthorized(false);
        setChecking(false);
        router.replace('/dashboard');
      } else {
        setAuthorized(true);
        setChecking(false);
      }

    }
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#ffffff', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f59e0b' }}>Authenticating Admin Clearance...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#ffffff', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center', padding: '2.5rem', background: '#0f172a', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.4)', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
          <ShieldAlert size={42} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>Access Denied</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Role-Based Access Control (RBAC): This section requires Root Admin clearance. Redirecting to Emergency Operator Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
