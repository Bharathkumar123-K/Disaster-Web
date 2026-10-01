'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Map, LayoutDashboard, Settings, FileText, ShieldAlert, Cpu, Radio } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Live Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
    { href: '/dashboard/map', label: 'India Tactical Map', icon: Map },
    { href: '/dashboard/reports', label: 'Incident Database', icon: FileText },
    { href: '/dashboard/analytics', label: 'Analytics & Telemetry', icon: Activity },
    { href: '/dashboard/settings', label: 'Command Settings', icon: Settings },
    { href: '/admin', label: 'Admin Portal', icon: ShieldAlert, badge: 'ROOT' },
  ];

  return (
    <aside className="sidebar">
      {/* Brand / Logo Header */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ 
            width: '34px', 
            height: '34px', 
            borderRadius: '10px', 
            background: 'rgba(16, 185, 129, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justify: 'center', 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
          }}>
            <ShieldAlert size={20} color="var(--accent-color)" />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>
              NEXUS <span style={{ color: 'var(--accent-color)' }}>INDIA</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              DISASTER COMMAND v2.4
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.5rem' }}>
          Core Modules
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '10px',
                  background: isActive ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  letterSpacing: '0.05em'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status Card */}
      <div style={{ padding: '1rem', borderTop: 'var(--border-color)', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '0.75rem',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
              <Radio size={12} color="var(--accent-color)" /> NODE: IN-CENTRAL-1
            </span>
            <span style={{ color: 'var(--accent-color)', fontWeight: 700 }} className="font-mono">14ms</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <Cpu size={12} color="var(--text-secondary)" /> NDRF / SDRF Neural Triage Active
          </div>
        </div>
      </div>
    </aside>
  );
}
