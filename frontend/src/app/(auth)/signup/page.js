'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, User, Building2, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  // Form State - initialized clean without prefilled demo text
  const [formData, setFormData] = useState({
    fullName: '',
    agency: '',
    email: '',
    password: ''
  });

  // UI State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errorMsg) setErrorMsg('');
  };

  // Handle Form Submission & Backend Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const name = formData.fullName.trim();
    const agency = formData.agency.trim();
    const email = formData.email.trim();
    const password = formData.password;

    // Client-side Validation
    if (!name) {
      setErrorMsg('Full Name is required.');
      return;
    }

    if (!agency) {
      setErrorMsg('Agency / Organization is required.');
      return;
    }

    if (!email) {
      setErrorMsg('Work Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          agency,
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setErrorMsg(data.error || 'Failed to create account. Please try again.');
        return;
      }

      // Success Feedback
      setSuccessMsg('Account created successfully. Please log in.');
      setIsLoading(false);

      // Do NOT auto-login or set localStorage user session
      // Redirect to /login after short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      console.error('[Signup Submit Error]:', err);
      setIsLoading(false);
      setErrorMsg('Network error. Could not connect to authentication server.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0f19', backgroundImage: 'radial-gradient(circle at 50% 0%, #151d30 0%, #0b0f19 75%)', padding: '1.5rem' }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        background: '#0f172a', 
        borderRadius: '20px', 
        border: '1px solid rgba(255, 255, 255, 0.12)', 
        padding: '2rem 2.25rem', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.45rem', color: '#ffffff', textDecoration: 'none', letterSpacing: '1px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
              <ShieldAlert size={24} color="#10b981" />
            </div>
            NEXUS <span style={{ color: '#10b981' }}>COMMAND</span>
          </Link>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '0.3rem', color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
          Create Account Access
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.84rem', lineHeight: '1.4' }}>
          Deploy command credentials for your organization & citizen network.
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#fca5a5',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            lineHeight: '1.4'
          }}>
            <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.4rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  outline: 'none', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  color: '#ffffff', 
                  fontSize: '0.9rem',
                  caretColor: '#10b981',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10
                }} 
                required
              />
              <User size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 11 }} />
            </div>
          </div>

          {/* Agency / Organization */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Agency / Organization *
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                placeholder="Enter agency / organization" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.4rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  outline: 'none', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  color: '#ffffff', 
                  fontSize: '0.9rem',
                  caretColor: '#10b981',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10
                }} 
                required
              />
              <Building2 size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 11 }} />
            </div>
          </div>

          {/* Work Email */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Work Email *
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter work email" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.4rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  outline: 'none', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  color: '#ffffff', 
                  fontSize: '0.9rem',
                  caretColor: '#10b981',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10
                }} 
                required
              />
              <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 11 }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password" 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.4rem', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  outline: 'none', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  color: '#ffffff', 
                  fontSize: '0.9rem',
                  caretColor: '#10b981',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 10
                }} 
                required
              />
              <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 11 }} />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: '#ffffff', 
              padding: '0.9rem', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: '800', 
              textAlign: 'center', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginTop: '0.5rem', 
              transition: 'all 0.2s ease', 
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
              cursor: isLoading ? 'wait' : 'pointer',
              fontSize: '0.95rem',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : 'Complete Setup'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
        </p>

      </div>
    </div>
  );
}
