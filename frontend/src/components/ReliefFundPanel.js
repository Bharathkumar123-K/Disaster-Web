'use client';

import { ExternalLink, HeartHandshake, ShieldCheck, AlertCircle } from 'lucide-react';
import { getReliefFundsForLocation } from '../data/reliefFundsConfig';

export default function ReliefFundPanel({ locationName = '', compact = false }) {
  const { stateName, funds } = getReliefFundsForLocation(locationName);

  return (
    <div style={{
      background: 'rgba(16, 185, 129, 0.05)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      borderLeft: '4px solid var(--accent-color)',
      borderRadius: '12px',
      padding: compact ? '0.85rem' : '1.15rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      marginTop: '1rem'
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>
          <HeartHandshake size={18} color="var(--accent-color)" />
          <span>Support Verified Relief Efforts</span>
        </div>
        {stateName && (
          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            {stateName.toUpperCase()} RELIEF
          </span>
        )}
      </div>

      {/* Official Fund Links List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {funds.map((fund) => (
          <div 
            key={fund.id}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: '0.75rem',
              transition: 'border-color 0.2s ease'
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>{fund.orgName}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--accent-color)', background: 'rgba(16, 185, 129, 0.12)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                  {fund.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {fund.shortDesc}
              </div>
            </div>

            <a 
              href={fund.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                background: 'rgba(16, 185, 129, 0.18)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Donate</span>
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>

      {/* Prominent Visible Disclaimer */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.4rem',
        fontSize: '0.72rem',
        color: '#f59e0b',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        padding: '0.45rem 0.65rem',
        borderRadius: '6px',
        lineHeight: '1.4'
      }}>
        <AlertCircle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          <strong>Notice:</strong> Donations are processed externally by listed official government organizations. This platform does not collect, process, or handle payments.
        </span>
      </div>
    </div>
  );
}
