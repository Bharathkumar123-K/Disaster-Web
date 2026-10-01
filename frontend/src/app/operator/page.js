'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OperatorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', color: '#ffffff', fontFamily: 'inherit' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>Redirecting to Emergency Operator Dashboard...</p>
      </div>
    </div>
  );
}
