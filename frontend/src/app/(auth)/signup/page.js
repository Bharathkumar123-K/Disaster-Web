import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.5rem 2rem', boxShadow: '0 10px 40px -10px rgba(6, 78, 59, 0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '1.5rem', color: 'var(--sidebar-bg)', textDecoration: 'none' }}>
            <ShieldAlert size={28} color="var(--accent-color)" /> NEXUS
          </Link>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '0.25rem', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Deploy the Command Center for your organization.</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Full Name</label>
            <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#f8fafc', fontSize: '0.95rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Agency / Organization</label>
            <input type="text" placeholder="FEMA Region 9" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#f8fafc', fontSize: '0.95rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Work Email</label>
            <input type="email" placeholder="john@agency.gov" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#f8fafc', fontSize: '0.95rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#f8fafc', fontSize: '0.95rem' }} />
          </div>
          
          <Link href="/dashboard" style={{ background: 'var(--accent-color)', color: '#ffffff', padding: '0.85rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', transition: 'opacity 0.2s', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
            Complete Setup <ArrowRight size={18} />
          </Link>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--sidebar-bg)', fontWeight: '600', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
