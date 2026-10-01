import Link from 'next/link';
import { ShieldAlert, Users, PhoneCall, AlertTriangle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "Citizen Safety & Disaster Response Portal",
  description: "Public Emergency Reporting, Media Attachment, Location Sharing, and Live Rescue Tracking",
};

export default function CitizenLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Citizen Header */}
      <header style={{ height: '70px', background: 'rgba(11, 15, 25, 0.95)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', sticky: 'top', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', textDecoration: 'none' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <ShieldAlert size={20} color="var(--accent-color)" />
            </div>
            NEXUS <span style={{ color: 'var(--accent-color)' }}>CITIZEN</span>
          </Link>

          <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            PUBLIC SAFETY PORTAL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.4rem 0.85rem', borderRadius: '20px', color: '#f43f5e', fontSize: '0.8rem', fontWeight: 700 }}>
            <PhoneCall size={14} /> Emergency Helpline: 112 / 108
          </div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', background: '#0b0f19' }}>
        Citizen Safety & Emergency Response Network · Emergency Services Hotline: 112 / NDRF: 011-24363260
      </footer>
    </div>
  );
}
