'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Radio, 
  Cpu, 
  FileSpreadsheet, 
  Lock, 
  ArrowLeft,
  Server,
  Zap,
  LogOut
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexus_user');
    }
    router.push('/login');
  };

  const navItems = [
    { href: '/admin', label: 'Overview & Telemetry', icon: Activity, badge: 'ROOT' },
    { href: '/admin/users', label: 'User & Access (RBAC)', icon: Users },
    { href: '/admin/ingestion', label: 'Data Feeds & Ingestion', icon: Radio },
    { href: '/admin/ai-engine', label: 'AI Triage & Rules', icon: Cpu },
    { href: '/admin/incidents', label: 'Master Incidents', icon: FileSpreadsheet },
    { href: '/admin/logs', label: 'Audit & Security Logs', icon: Lock },
  ];

  return (
    <aside className="sidebar" style={{ background: 'linear-gradient(180deg, #0c1322 0%, #060911 100%)', borderRight: '1px solid rgba(245, 158, 11, 0.2)' }}>
      {/* Brand Header */}
      <div className="sidebar-header" style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.15)', background: 'rgba(245, 158, 11, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'rgba(245, 158, 11, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.25)'
          }}>
            <ShieldAlert size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>
              NEXUS <span style={{ color: '#f59e0b' }}>ADMIN</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={10} color="#f59e0b" /> LEVEL 0 ROOT GOVERNANCE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.5rem' }}>
          Admin Modules
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                borderLeftColor: isActive ? '#f59e0b' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <item.icon size={18} style={{ color: isActive ? '#f59e0b' : 'inherit' }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="admin-badge">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Node Status Box & Logout */}
      <div style={{ padding: '1rem', borderTop: 'var(--border-color)', background: 'rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '10px',
          padding: '0.75rem',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
              <Server size={12} color="#f59e0b" /> SYSTEM CLUSTER
            </span>
            <span style={{ color: '#10b981', fontWeight: 700 }} className="font-mono">HEALTHY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Superuser Session: Active
          </div>
        </div>

        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#f43f5e',
            padding: '0.65rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} />
          <span>Exit / Logout</span>
        </button>
      </div>
    </aside>
  );
}
