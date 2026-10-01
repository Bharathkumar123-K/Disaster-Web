'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  User, 
  Globe, 
  X, 
  Shield, 
  Bell, 
  Settings, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Bot, 
  MapPin, 
  ChevronRight, 
  Copy, 
  Check, 
  Activity,
  Award,
  Radio,
  Flame,
  Waves,
  Ambulance,
  AlertTriangle
} from 'lucide-react';
import { useDisaster } from './DisasterProvider';

export default function TopBar() {
  const router = useRouter();
  const { 
    events, 
    handleAction, 
    getRecommendation, 
    searchQuery, 
    setSearchQuery, 
    selectedEvent, 
    setSelectedEvent 
  } = useDisaster();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsSearchOpen(false);
        setIsProfileModalOpen(false);
        setSelectedEvent(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedEvent]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter events based on search query and category filter
  const filteredEvents = events.filter(e => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.severity && e.severity.toLowerCase().includes(q)) ||
      (e.locationName && e.locationName.toLowerCase().includes(q)) ||
      (e.text && e.text.toLowerCase().includes(q)) ||
      (e.status && e.status.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'all' || 
      (categoryFilter === 'live' ? e.status === 'pending' || e.status === 'approved' :
       categoryFilter === 'critical' ? e.severity === 'critical' : e.category === categoryFilter);

    return matchesQuery && matchesCategory;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleCopyOfficerId = () => {
    navigator.clipboard.writeText('NX-8942-US');
    setCopiedId(true);
    showToast('Officer Badge ID copied to clipboard!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    showToast('Signing out of NEXUS Command Center...');
    setTimeout(() => {
      router.push('/login');
    }, 600);
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    showToast(newState ? 'Alert Notifications Enabled' : 'Alert Notifications Muted');
  };

  return (
    <>
      <header className="topbar">
        {/* Left Section */}
        <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(16, 185, 129, 0.08)', 
            padding: '0.45rem 0.9rem', 
            borderRadius: '20px', 
            border: '1px solid rgba(16, 185, 129, 0.2)' 
          }}>
            <Globe size={16} color="var(--accent-color)" className="animate-spin-slow" />
            <span style={{ fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-primary)' }}>
              India Tactical Grid
            </span>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Socket Connection Status */}
          <div className="status-indicator" title="Real-time WebSocket active for live telemetry">
            <div className="status-dot"></div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>SOCKET CONNECTED · 12ms</span>
          </div>

          {/* Admin Portal Quick Button */}
          <Link 
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#f59e0b',
              padding: '0.45rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.2)'
            }}
          >
            <Shield size={15} color="#f59e0b" />
            <span>ADMIN PORTAL</span>
          </Link>

          {/* Search Box Container */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button 
                type="submit" 
                title="Search incidents"
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: 0,
                  color: searchQuery ? 'var(--accent-color)' : 'var(--text-secondary)'
                }}
              >
                <Search size={16} />
              </button>

              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search events, locations, status..." 
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: isSearchOpen ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  padding: '0.55rem 2.2rem 0.55rem 2.4rem',
                  borderRadius: '20px',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.85rem',
                  width: '280px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSearchOpen ? '0 0 0 3px rgba(16, 185, 129, 0.25)' : 'none'
                }} 
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  title="Clear search"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </form>

            {/* Interactive Live Search Dropdown */}
            {isSearchOpen && (
              <div className="search-dropdown-menu" style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '440px',
                maxHeight: '520px',
                background: '#0f172a',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Sticky Header Section: Search Header + Filter Chip Row */}
                <div style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 20,
                  background: '#0f172a',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  flexShrink: 0
                }}>
                  {/* Search Header */}
                  <div style={{ padding: '0.85rem 1.25rem 0.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Search size={14} color="var(--accent-color)" /> Incident Matches ({filteredEvents.length})
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Press Esc to close
                    </span>
                  </div>

                  {/* Filter Chip Row */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.4rem', 
                    padding: '0.65rem 1rem', 
                    background: '#0f172a', 
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    boxSizing: 'border-box'
                  }}>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'live', label: '⚡ Live' },
                      { id: 'flood', label: '🌊 Flood' },
                      { id: 'medical', label: '🚑 Medical' },
                      { id: 'critical', label: '⚠️ Critical' },
                      { id: 'fire', label: '🔥 Fire' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCategoryFilter(tab.id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: categoryFilter === tab.id ? '1px solid var(--accent-color)' : '1px solid rgba(255, 255, 255, 0.1)',
                          background: categoryFilter === tab.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          color: categoryFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                          flexShrink: 0
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrollable Results List Body */}
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  maxHeight: '340px', 
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxSizing: 'border-box'
                }}>
                  {filteredEvents.length === 0 ? (
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <AlertTriangle size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5, color: 'var(--warning-color)' }} />
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>No matching incidents found</p>
                      <p style={{ fontSize: '0.78rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>Try searching by category, location, or severity.</p>
                    </div>
                  ) : (
                    filteredEvents.map(event => {
                      return (
                        <div 
                          key={event._id} 
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsSearchOpen(false);
                          }}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-color)';
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <span className={`badge badge-${event.severity}`} style={{ fontSize: '0.65rem' }}>
                              {event.category} - {event.severity}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="font-mono">
                              {event.confidenceScore}% MATCH
                            </span>
                          </div>
                          
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0 0 0.35rem', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                            {event.text}
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} color="var(--accent-color)" /> {event.locationName || 'Unknown location'}
                            </span>
                            <span style={{ 
                              textTransform: 'uppercase', 
                              fontWeight: 700,
                              color: event.status === 'approved' ? 'var(--success-color)' : event.status === 'dismissed' ? 'var(--danger-color)' : 'var(--warning-color)'
                            }}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer link to reports */}
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center', flexShrink: 0 }}>
                  <Link 
                    href="/dashboard/reports" 
                    onClick={() => setIsSearchOpen(false)}
                    style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    View All Incidents Database <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar Button & Dropdown */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User profile menu"
              title="Officer Profile & Command Controls"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isProfileOpen ? 'var(--accent-color)' : 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                border: isProfileOpen ? '2px solid var(--accent-color)' : '1.5px solid rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                outline: 'none',
                boxShadow: isProfileOpen ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none'
              }}
            >
              <User size={20} color={isProfileOpen ? '#ffffff' : 'var(--accent-color)'} />
              
              {/* Online Indicator Dot */}
              <span style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #0b0f19',
                boxShadow: '0 0 6px #10b981'
              }} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="profile-dropdown-menu" style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '320px',
                background: '#0f172a',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                {/* Header User Card */}
                <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '1.25rem', color: '#ffffff', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      border: '2px solid var(--accent-color)',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      color: 'var(--accent-color)'
                    }}>
                      SJ
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                        Cmdr. Sarah Jenkins
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        Lead Dispatch Officer
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'space-between',
                    background: 'rgba(0, 0, 0, 0.4)', 
                    padding: '0.4rem 0.75rem', 
                    borderRadius: '8px', 
                    fontSize: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>BADGE: <strong style={{ color: '#fff' }} className="font-mono">NX-8942-US</strong></span>
                    <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.68rem', fontWeight: '800' }}>
                      LEVEL 5 ADMIN
                    </span>
                  </div>
                </div>

                {/* Menu List */}
                <div style={{ padding: '0.5rem' }}>
                  
                  {/* View Credentials */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Award size={18} color="var(--accent-color)" />
                    <div style={{ flex: 1 }}>
                      <div>Agency Credentials & Badge</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>View full officer clearance card</div>
                    </div>
                  </button>

                  {/* Settings Link */}
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Settings size={18} color="var(--text-secondary)" />
                    <div style={{ flex: 1 }}>
                      <div>Command Center Settings</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Configure dispatch threshold & APIs</div>
                    </div>
                  </Link>

                  {/* Toggle Audio Notifications */}
                  <button
                    onClick={toggleNotifications}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Bell size={18} color={notificationsEnabled ? 'var(--accent-color)' : 'var(--text-secondary)'} />
                    <div style={{ flex: 1 }}>
                      <div>Sound & Alert Broadcasts</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {notificationsEnabled ? 'Live chime enabled' : 'Muted'}
                      </div>
                    </div>
                  </button>

                  {/* Copy Badge ID */}
                  <button
                    onClick={handleCopyOfficerId}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {copiedId ? <Check size={18} color="var(--accent-color)" /> : <Copy size={18} color="var(--text-secondary)" />}
                    <div style={{ flex: 1 }}>
                      <div>Copy Officer ID</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>NX-8942-US</div>
                    </div>
                  </button>

                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '0.4rem 0' }} />

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(244, 63, 94, 0.1)',
                      color: 'var(--danger-color)',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
                  >
                    <LogOut size={18} />
                    <span>Sign Out & Lock Station</span>
                  </button>

                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          border: '1px solid var(--accent-color)',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: '600',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <CheckCircle size={18} color="var(--accent-color)" />
          {toastMessage}
        </div>
      )}

      {/* Officer Credentials Modal */}
      {isProfileModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '1.5rem'
        }} onClick={() => setIsProfileModalOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#0f172a',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              animation: 'scaleUp 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '1.5rem', color: '#ffffff', position: 'relative', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  border: '3px solid var(--accent-color)',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: 'var(--accent-color)'
                }}>
                  SJ
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Cmdr. Sarah Jenkins</h3>
                  <p style={{ color: 'var(--accent-color)', margin: '4px 0 0', fontSize: '0.88rem', fontWeight: 600 }}>
                    Lead Dispatch Director & Incident Tactician
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Badge / Serial</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }} className="font-mono">NX-8942-US</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Clearance Level</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-color)', marginTop: '2px' }}>Level 5 (Full Admin)</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Agency</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>FEMA / NEXUS Unit</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Active Station</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>Command Pod #4</div>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Radio size={16} color="var(--accent-color)" /> Emergency Authorization Active
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  Authorized to override AI dispatch suggestions, trigger automated broadcast alerts, and issue immediate priority resource allocation.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Close Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Detail Inspection Modal (Triggered by clicking search result) */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '1.5rem'
        }} onClick={() => setSelectedEvent(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#0f172a',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
              overflow: 'hidden',
              animation: 'scaleUp 0.2s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge badge-${selectedEvent.severity}`} style={{ fontSize: '0.75rem' }}>
                  {selectedEvent.category} - {selectedEvent.severity}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="font-mono">
                  CONFIDENCE: {selectedEvent.confidenceScore}%
                </span>
              </div>

              <button 
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '1.25rem', fontWeight: 400 }}>
                {selectedEvent.text}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                <MapPin size={16} color="var(--accent-color)" />
                <strong>Location:</strong> {selectedEvent.locationName || 'Unknown Location'}
              </div>

              {/* AI Recommendation */}
              {getRecommendation(selectedEvent._id) && (
                <div className="premium-rec-box" style={{ marginBottom: '1.5rem' }}>
                  <div className="premium-rec-title">
                    <Bot size={18} color="var(--accent-color)" /> AI Dispatch Recommendation
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Department: <strong style={{ color: '#ffffff' }}>{getRecommendation(selectedEvent._id).suggestedDepartment}</strong> ({getRecommendation(selectedEvent._id).priorityLevel})<br/>
                    Resources: {getRecommendation(selectedEvent._id).suggestedResources.join(', ')}
                  </div>
                </div>
              )}

              {/* Current Status */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  Action Status
                </div>
                <div className={`status-label ${selectedEvent.status}`} style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {selectedEvent.status === 'approved' ? <CheckCircle size={18} /> : selectedEvent.status === 'dismissed' ? <XCircle size={18} /> : <Activity size={18} />}
                  {selectedEvent.status}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-approve" 
                  onClick={() => handleAction(selectedEvent._id, 'approve')}
                  disabled={selectedEvent.status === 'approved'}
                  style={{ 
                    flex: 1, 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    justify: 'center', 
                    gap: '0.5rem', 
                    fontWeight: '600',
                    opacity: selectedEvent.status === 'approved' ? 0.6 : 1,
                    cursor: selectedEvent.status === 'approved' ? 'not-allowed' : 'pointer'
                  }}
                >
                  <CheckCircle size={18} /> Approve Incident Action
                </button>
                
                <button 
                  className="btn btn-dismiss" 
                  onClick={() => handleAction(selectedEvent._id, 'dismiss')}
                  disabled={selectedEvent.status === 'dismissed'}
                  style={{ 
                    flex: 1, 
                    padding: '0.75rem', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    justify: 'center', 
                    gap: '0.5rem', 
                    fontWeight: '600',
                    opacity: selectedEvent.status === 'dismissed' ? 0.6 : 1,
                    cursor: selectedEvent.status === 'dismissed' ? 'not-allowed' : 'pointer'
                  }}
                >
                  <XCircle size={18} /> Dismiss Signal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
