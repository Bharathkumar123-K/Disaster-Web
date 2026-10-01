'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  Building2, 
  Users, 
  Radio, 
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  KeyRound,
  X,
  Mail,
  HelpCircle
} from 'lucide-react';

// Preset System Accounts with assigned roles for authentication verification
const PRESET_ACCOUNTS = [
  {
    email: 'admin@nexuscommand.org',
    password: 'admin123',
    role: 'admin',
    name: 'Cmdr. Rajesh Sharma',
    badge: 'DIR-ROOT-CLEARANCE-0'
  },
  {
    email: 'director@fema.gov',
    password: 'secrettoken123',
    role: 'admin',
    name: 'Director Sarah Jenkins',
    badge: 'ROOT-LEVEL-0'
  },
  {
    email: 'citizen@nexuscommand.org',
    password: 'citizen123',
    role: 'citizen',
    name: 'Rohan Verma',
    badge: 'PUBLIC-CITIZEN-SOS'
  },
  {
    email: 'rohan.verma@gmail.com',
    password: 'userpass123',
    role: 'citizen',
    name: 'Rohan Verma',
    badge: 'PUBLIC-CITIZEN-SOS'
  },
  {
    email: 'operator@nexuscommand.org',
    password: 'operator123',
    role: 'operator',
    name: 'Operator Dispatcher Mark',
    badge: 'NX-OPERATOR-DISPATCH'
  },
  {
    email: 'jenkins.sarah@nexuscommand.org',
    password: 'secrettoken123',
    role: 'operator',
    name: 'Dispatcher Sarah Jenkins',
    badge: 'NX-8942-US'
  }
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected role tab ('admin' | 'citizen' | 'operator')
  const initialRole = searchParams.get('role') || searchParams.get('portal') || 'admin';
  const [role, setRole] = useState(initialRole);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Sync role with search query if present
  useEffect(() => {
    const paramRole = searchParams.get('role') || searchParams.get('portal');
    if (paramRole && ['admin', 'citizen', 'operator'].includes(paramRole)) {
      setRole(paramRole);
    }
  }, [searchParams]);

  // Load remembered email if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('nexus_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, []);

  // Autofill helper credentials when tab changes (can be overridden by user)
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    if (newRole === 'admin') {
      setEmail('admin@nexuscommand.org');
      setPassword('admin123');
    } else if (newRole === 'citizen') {
      setEmail('citizen@nexuscommand.org');
      setPassword('citizen123');
    } else if (newRole === 'operator') {
      setEmail('operator@nexuscommand.org');
      setPassword('operator123');
    }
  };

  // Authenticate user with role verification
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      let accounts = [...PRESET_ACCOUNTS];

      // Merge user signups from localStorage
      if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem('nexus_registered_users');
        if (storedUsers) {
          try {
            const parsed = JSON.parse(storedUsers);
            if (Array.isArray(parsed)) {
              accounts = [...accounts, ...parsed];
            }
          } catch (err) {
            console.error('Error parsing stored users:', err);
          }
        }
      }

      const inputEmail = email.trim().toLowerCase();
      const userAccount = accounts.find(acc => acc.email.toLowerCase() === inputEmail);

      // Check credential validity
      if (!userAccount || userAccount.password !== password) {
        setIsLoading(false);
        setErrorMsg('Authentication Failed: Invalid Email / Account ID or Password.');
        return;
      }

      // Check role authorization (Role-Based Authentication)
      if (userAccount.role !== role) {
        setIsLoading(false);
        setErrorMsg(`Access Denied: Your account is assigned to the ${userAccount.role.toUpperCase()} role, which does not match the selected ${role.toUpperCase()} portal.`);
        return;
      }

      // Successful Auth
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('nexus_remembered_email', email);
        } else {
          localStorage.removeItem('nexus_remembered_email');
        }

        const userSession = {
          role: userAccount.role,
          email: userAccount.email,
          name: userAccount.name,
          badge: userAccount.badge
        };
        localStorage.setItem('nexus_user', JSON.stringify(userSession));
      }

      // Redirect to specific dashboard
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'citizen') {
        router.push('/citizen');
      } else if (role === 'operator') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 450);
  };

  // Handle Password Reset Request
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setShowForgotModal(false);
      setResetEmail('');
    }, 2500);
  };

  // Theme configuration for each role
  const getRoleConfig = () => {
    if (role === 'admin') {
      return {
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.4)',
        btnBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        btnShadow: '0 6px 20px rgba(245, 158, 11, 0.35)',
        portalTitle: 'Admin Command Portal',
        description: 'Authorized disaster directors, NDRF/SDRF commanders & AI triage managers.',
        icon: Building2,
        btnText: 'Login to Admin Portal',
        presetNotice: 'Default Admin Demo: admin@nexuscommand.org / admin123'
      };
    } else if (role === 'citizen') {
      return {
        color: 'var(--accent-color)',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
        btnBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        btnShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
        portalTitle: 'Citizen Safety Portal',
        description: 'Disaster warnings, real-time SOS distress reports & rescue tracking.',
        icon: Users,
        btnText: 'Login to Citizen Portal',
        presetNotice: 'Default Citizen Demo: citizen@nexuscommand.org / citizen123'
      };
    } else {
      return {
        color: '#38bdf8',
        bgColor: 'rgba(56, 189, 248, 0.15)',
        borderColor: 'rgba(56, 189, 248, 0.4)',
        btnBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        btnShadow: '0 6px 20px rgba(2, 132, 199, 0.35)',
        portalTitle: 'Emergency Operator Portal',
        description: 'Assigned incident handling, hotline intake coordination & dispatch status.',
        icon: Radio,
        btnText: 'Login to Operator Portal',
        presetNotice: 'Default Operator Demo: operator@nexuscommand.org / operator123'
      };
    }
  };

  const config = getRoleConfig();
  const RoleIcon = config.icon;

  return (
    <div style={{ width: '100%', maxWidth: '480px', background: '#0f172a', borderRadius: '24px', border: `1px solid ${config.borderColor}`, padding: '2.25rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)', position: 'relative', transition: 'all 0.3s ease' }}>
      
      {/* Brand Header */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.45rem', color: '#ffffff', textDecoration: 'none', letterSpacing: '1px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: config.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${config.color}50`, boxShadow: `0 0 15px ${config.color}30` }}>
            <ShieldAlert size={24} color={config.color} />
          </div>
          NEXUS <span style={{ color: config.color }}>COMMAND</span>
        </Link>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '0.25rem', color: '#ffffff', fontSize: '1.3rem', fontWeight: 800 }}>
        Unified Disaster Portal Login
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.82rem', lineHeight: '1.4' }}>
        Single authentication entry. Select your assigned role to access your dashboard.
      </p>

      {/* REQUIREMENT 3: Three Selectable Roles at Top of Form */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Select Access Role
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', background: 'rgba(0,0,0,0.45)', padding: '0.35rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          
          {/* Role 1: Admin */}
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            style={{
              padding: '0.7rem 0.3rem',
              borderRadius: '10px',
              border: role === 'admin' ? '1px solid #f59e0b' : '1px solid transparent',
              background: role === 'admin' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: role === 'admin' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={15} color={role === 'admin' ? '#f59e0b' : 'currentColor'} />
            Admin
          </button>

          {/* Role 2: Citizen */}
          <button
            type="button"
            onClick={() => handleRoleChange('citizen')}
            style={{
              padding: '0.7rem 0.3rem',
              borderRadius: '10px',
              border: role === 'citizen' ? '1px solid var(--accent-color)' : '1px solid transparent',
              background: role === 'citizen' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: role === 'citizen' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={15} color={role === 'citizen' ? 'var(--accent-color)' : 'currentColor'} />
            Citizen
          </button>

          {/* Role 3: Operator */}
          <button
            type="button"
            onClick={() => handleRoleChange('operator')}
            style={{
              padding: '0.7rem 0.3rem',
              borderRadius: '10px',
              border: role === 'operator' ? '1px solid #38bdf8' : '1px solid transparent',
              background: role === 'operator' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: role === 'operator' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
          >
            <Radio size={15} color={role === 'operator' ? '#38bdf8' : 'currentColor'} />
            Operator
          </button>
        </div>
      </div>

      {/* REQUIREMENT 5: Dynamic Role Badge & Description */}
      <div style={{
        background: config.bgColor,
        border: `1px solid ${config.color}40`,
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        marginBottom: '1.25rem',
        fontSize: '0.8rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <RoleIcon size={18} color={config.color} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 800, color: config.color, fontSize: '0.84rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {config.portalTitle}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {config.description}
          </div>
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          color: '#fca5a5',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
          lineHeight: '1.4'
        }}>
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* REQUIREMENT 2: Single Unified Login Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        
        {/* Email Field */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Email / Account ID
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@nexuscommand.org" 
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${config.color}40`, outline: 'none', background: 'rgba(255, 255, 255, 0.04)', color: '#ffffff', fontSize: '0.9rem' }} 
            required
          />
        </div>
        
        {/* Password Field */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Password / Clearance Token
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••" 
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${config.color}40`, outline: 'none', background: 'rgba(255, 255, 255, 0.04)', color: '#ffffff', fontSize: '0.9rem' }} 
            required
          />
        </div>
        
        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: config.color, cursor: 'pointer' }} 
            /> Remember station clearance
          </label>
          
          <button 
            type="button"
            onClick={() => {
              setResetEmail(email);
              setShowForgotModal(true);
            }}
            style={{ background: 'none', border: 'none', color: config.color, cursor: 'pointer', fontWeight: '600', padding: 0, fontSize: '0.82rem' }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Dynamic Submit Button */}
        <button 
          type="submit"
          disabled={isLoading}
          style={{ 
            background: config.btnBg,
            color: '#ffffff', 
            padding: '0.9rem', 
            borderRadius: '12px', 
            border: 'none',
            fontWeight: '800', 
            textAlign: 'center', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.6rem', 
            marginTop: '0.25rem', 
            boxShadow: config.btnShadow, 
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? (
            'Authenticating Clearance...'
          ) : (
            <>
              {config.btnText}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Preset Credential Helper Box */}
      <div style={{ marginTop: '1.25rem', padding: '0.6rem 0.8rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px dashed rgba(255, 255, 255, 0.15)', fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        <HelpCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
        {config.presetNotice}
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link href="/signup" style={{ color: config.color, fontWeight: '700', textDecoration: 'none' }}>Create Account Access</Link>
      </p>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#0f172a',
            border: `1px solid ${config.color}50`,
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowForgotModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <KeyRound size={22} color={config.color} />
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>Reset Password</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Enter your registered Email or Account ID below. We will send a secure password reset link and station clearance token.
            </p>

            {resetSuccess ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1rem', borderRadius: '12px', color: '#6ee7b7', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                Password reset link dispatched to {resetEmail}! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Registered Email / Account ID
                  </label>
                  <input 
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="user@nexuscommand.org"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${config.color}40`, outline: 'none', background: 'rgba(255, 255, 255, 0.04)', color: '#ffffff', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  style={{ background: config.btnBg, color: '#ffffff', padding: '0.85rem', borderRadius: '10px', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem' }}
                >
                  Send Reset Clearance Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)', padding: '1.5rem' }}>
      <Suspense fallback={
        <div style={{ color: '#ffffff', fontWeight: 600 }}>Loading Unified Access Gateway...</div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
