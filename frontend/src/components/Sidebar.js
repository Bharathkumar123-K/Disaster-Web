'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  ShieldAlert, 
  Cpu, 
  Radio, 
  LifeBuoy, 
  Globe, 
  Truck, 
  Bell, 
  Settings 
} from 'lucide-react';
import { useDisaster } from './DisasterProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState('operator');
  const { citizenEvents, externalEvents } = useDisaster();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nexus_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role) {
            setRole(parsed.role);
          }
        } catch (err) {
          console.error('Error parsing stored user in Sidebar:', err);
        }
      }
    }
  }, []);

  const pendingCitizenCount = citizenEvents.filter(e => e.status === 'pending').length;
  const pendingExternalCount = externalEvents.filter(e => e.status === 'pending').length;

  // Operator Portal Menu Items
  const operatorNavItems = [
    { href: '/dashboard', label: 'Operations Dashboard', icon: LayoutDashboard, badge: null },
    { href: '/dashboard/citizen-issues', label: 'Citizen Issues', icon: LifeBuoy, badge: pendingCitizenCount > 0 ? `${pendingCitizenCount} SOS` : null, badgeColor: '#f43f5e', iconColor: '#f43f5e' },
    { href: '/dashboard/external-issues', label: 'External & AI Issues', icon: Globe, badge: pendingExternalCount > 0 ? `${pendingExternalCount} NEW` : null, badgeColor: '#38bdf8', iconColor: '#38bdf8' },
    { href: '/dashboard/map', label: 'Live Incident Map', icon: Map, badge: 'TACTICAL' },
    { href: '/dashboard/response-coordination', label: 'Response & Resources', icon: Truck, badge: null },
    { href: '/dashboard/alerts', label: 'Live Alerts', icon: Bell, badge: null },
    { href: '/dashboard/reports', label: 'Incident History', icon: FileText, badge: null },
  ];

  // Admin Portal Menu Items (Only if user is root admin)
  const adminNavItems = [
    ...operatorNavItems,
    { href: '/dashboard/settings', label: 'Command Settings', icon: Settings, badge: 'ADMIN' },
    { href: '/admin', label: 'Admin Portal', icon: ShieldAlert, badge: 'ROOT' },
  ];

  const navItems = role === 'admin' ? adminNavItems : operatorNavItems;

  return (
    <aside className="sidebar">
      {/* Brand / Logo Header */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'rgba(16, 185, 129, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justify: 'center', 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
          }}>
            <ShieldAlert size={22} color="var(--accent-color)" />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '1px', color: '#ffffff' }}>
              NEXUS <span style={{ color: 'var(--accent-color)' }}>COMMAND</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
              OPERATOR DISPATCH v2.4
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0.5rem 0.5rem' }}>
          Dispatch Operations
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComp = item.icon;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <IconComp size={18} color={isActive ? 'var(--accent-color)' : item.iconColor || 'currentColor'} />
              <span style={{ flex: 1, fontWeight: isActive ? 800 : 600 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '10px',
                  background: isActive ? 'var(--accent-color)' : (item.badgeColor || 'rgba(255, 255, 255, 0.1)'),
                  color: '#ffffff',
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
              <Radio size={12} color="var(--accent-color)" /> DISPATCH NODE: IN-CENTRAL-1
            </span>
            <span style={{ color: 'var(--accent-color)', fontWeight: 700 }} className="font-mono">ONLINE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <Cpu size={12} color="var(--text-secondary)" /> NDRF / SDRF Neural Triage Active
          </div>
        </div>
      </div>
    </aside>
  );
}
