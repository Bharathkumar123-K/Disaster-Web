'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldAlert, 
  UserCheck, 
  Building2, 
  Users, 
  ArrowRight, 
  Globe, 
  Zap, 
  Activity, 
  ShieldCheck, 
  FileText, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  Radio, 
  AlertTriangle 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
      
      {/* Top Header Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(11, 15, 25, 0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '1px', color: '#ffffff', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
            <ShieldAlert size={22} color="var(--accent-color)" />
          </div>
          NEXUS <span style={{ color: 'var(--accent-color)' }}>COMMAND</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <a href="#portal-selection" style={{ color: '#ffffff', textDecoration: 'none' }}>Portal Access</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>System Architecture</a>
          <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Emergency Contacts</a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', padding: '0.55rem 1.4rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
            <Lock size={15} style={{ marginRight: '6px' }} /> Login to Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '4rem 4rem 2rem 4rem', textAlign: 'center', maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.35rem 1.1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
          <Zap size={14} color="var(--accent-color)" /> Unified National Disaster Management Platform
        </div>
        
        <h1 style={{ fontSize: '3.75rem', fontWeight: 800, lineHeight: '1.15', marginBottom: '1.25rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
          Real-Time Disaster Intelligence & <br/><span style={{ color: 'var(--accent-color)' }}>Public Safety Response System</span>
        </h1>
        
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '780px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
          A single integrated disaster management suite powering emergency authorities with AI incident triage while enabling citizens to receive alerts, report SOS distress, and track rescue dispatch.
        </p>

        {/* ------------------------------------------------------------- */}
        {/* UNIFIED PORTAL ACCESS SECTION (SINGLE LOGIN CTA)              */}
        {/* ------------------------------------------------------------- */}
        <div id="portal-selection" style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          marginBottom: '4rem',
          position: 'relative'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-color)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
            <ShieldCheck size={16} /> Unified Access Point
          </div>

          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
            One Portal for All Roles
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
            Access Admin Command, Public Citizen Safety, or Emergency Dispatch Operator dashboards through our single secure login gateway. Select your role on entry.
          </p>

          {/* 3 Role Highlight Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left', marginBottom: '2.5rem' }}>
            
            {/* Admin Role */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <Building2 size={22} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>Admin Command</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Disaster monitoring, AI incident analysis, resource allocation, and department clearance management.
              </p>
            </div>

            {/* Citizen Role */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Users size={22} color="var(--accent-color)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>Citizen Portal</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Disaster warnings, real-time SOS reporting, scene photo/video uploads, and report status tracking.
              </p>
            </div>

            {/* Operator Role */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <Radio size={22} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>Emergency Operator</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Assigned incident handling, hotline intake coordination, unit dispatch, and live status updates.
              </p>
            </div>

          </div>

          {/* SINGLE LOGIN BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link href="/login" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', padding: '1rem 2.5rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 800, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)' }}>
              <Lock size={20} /> Login to Portal <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', position: 'relative', width: '100%', height: '460px', background: '#0f172a' }}>
          <Image src="/assets/hero_map.png" alt="Nexus Tactical Map Interface" fill style={{ objectFit: 'cover' }} priority />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 4rem', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0b0f19', marginTop: '4rem' }}>
        <p style={{ fontSize: '0.85rem' }}>&copy; 2026 Nexus Disaster Command Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
