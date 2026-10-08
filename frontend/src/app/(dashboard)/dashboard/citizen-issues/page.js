'use client';

import { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Truck, 
  AlertTriangle, 
  ImageIcon, 
  Eye, 
  Sparkles,
  Layers,
  Check,
  X
} from 'lucide-react';
import { useDisaster } from '../../../../components/DisasterProvider';
import IncidentDetailModal from '../../../../components/IncidentDetailModal';

import NexusSelect from '../../../../components/NexusSelect';

export default function CitizenIssuesPage() {

  const { citizenEvents, loading, approveIncident, rejectIncident } = useDisaster();

  // Filters State
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Selected Event for Modal
  const [modalEvent, setModalEvent] = useState(null);

  // Reject Confirmation Modal State
  const [rejectModalEvent, setRejectModalEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('False / Invalid Report');
  const [customReason, setCustomReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
        <p style={{ fontWeight: 700, color: 'var(--accent-color)' }}>Loading Citizen SOS Incident Intake Module...</p>
      </div>
    );
  }

  // Filter citizen events strictly
  const filteredCitizenEvents = citizenEvents.filter(e => {
    // Query search
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      (e.locationName && e.locationName.toLowerCase().includes(q)) ||
      (e.text && e.text.toLowerCase().includes(q)) ||
      (e.citizenName && e.citizenName.toLowerCase().includes(q)) ||
      (e._id && e._id.toLowerCase().includes(q));

    // Filters
    const matchesSeverity = severityFilter === 'all' || e.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  // Calculate live counters
  const totalSOS = citizenEvents.length;
  const pendingCount = citizenEvents.filter(e => e.status === 'pending' || e.status === 'pending_review' || !e.status).length;
  const activeDispatchCount = citizenEvents.filter(e => e.status === 'approved' || e.status === 'response_assigned' || e.status === 'responding').length;
  const rejectedCount = citizenEvents.filter(e => e.status === 'rejected' || e.status === 'dismissed').length;

  const handleApprove = async (eventId) => {
    try {
      await approveIncident(eventId, 'Operator Dispatcher');
      showToast('Citizen incident approved successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to approve incident');
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    const finalReason = rejectionReason === 'Other' ? customReason.trim() : rejectionReason;
    if (!finalReason) {
      alert('Please select or enter a rejection reason.');
      return;
    }
    setIsRejecting(true);
    try {
      await rejectIncident(rejectModalEvent._id, finalReason, 'Operator Dispatcher');
      showToast('Citizen report rejected successfully.');
      setRejectModalEvent(null);
      setCustomReason('');
      setRejectionReason('False / Invalid Report');
    } catch (err) {
      console.error(err);
      showToast('Failed to reject incident');
    }
    setIsRejecting(false);
  };

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
              <LifeBuoy size={22} color="#f43f5e" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              🆘 Citizen Issues & Distress Module
            </h2>
            <span style={{ background: 'rgba(244, 63, 94, 0.25)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '12px' }}>
              STRICT CITIZEN INTAKE ONLY
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '720px' }}>
            Direct real-time distress reports submitted by citizens via Citizen Safety Portal. Review field evidence, approve or reject reports, and dispatch response teams.
          </p>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Total SOS Intake</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }} className="font-mono">{totalSOS}</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Pending Review</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b' }} className="font-mono">{pendingCount}</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase' }}>Active Dispatches</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-color)' }} className="font-mono">{activeDispatchCount}</div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '0.65rem 1rem', textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>Rejected</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444' }} className="font-mono">{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search citizen reports, locations, names..." 
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              borderRadius: '10px',
              background: '#0b0f19',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Category Filter */}
          <div style={{ minWidth: '180px' }}>
            <NexusSelect 
              value={categoryFilter} 
              onChange={(e, val) => setCategoryFilter(val)}
              options={[
                { value: 'all', label: 'Category: All Types' },
                { value: 'flood', label: '🌊 Flood / Inundation' },
                { value: 'fire', label: '🔥 Fire Breakout' },
                { value: 'cyclone', label: '🌀 Cyclone Storm' },
                { value: 'collapse', label: '🏗️ Landslide / Collapse' },
                { value: 'medical', label: '🚑 Medical Emergency' }
              ]}
            />
          </div>

          {/* Severity Filter */}
          <div style={{ minWidth: '170px' }}>
            <NexusSelect 
              value={severityFilter} 
              onChange={(e, val) => setSeverityFilter(val)}
              options={[
                { value: 'all', label: 'Severity: All Levels' },
                { value: 'critical', label: '🔴 Critical SOS' },
                { value: 'high', label: '🟠 High Severity' },
                { value: 'medium', label: '🟡 Medium' },
                { value: 'low', label: '🟢 Low' }
              ]}
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '180px' }}>
            <NexusSelect 
              value={statusFilter} 
              onChange={(e, val) => setStatusFilter(val)}
              options={[
                { value: 'all', label: 'Status: All Statuses' },
                { value: 'pending', label: '⏳ Pending Review' },
                { value: 'approved', label: '✅ Approved' },
                { value: 'rejected', label: '❌ Rejected' },
                { value: 'response_assigned', label: '🚒 Response Assigned' },
                { value: 'resolved', label: '🟢 Resolved' }
              ]}
            />
          </div>
        </div>

      </div>

      {/* Incident Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
        {filteredCitizenEvents.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '4rem 1rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
            <AlertTriangle size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>No Citizen Issues matching current filter</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Adjust search query or filter tags to inspect public SOS distress reports.
            </p>
          </div>
        ) : (
          filteredCitizenEvents.map(event => {
            const isPendingReview = !event.status || event.status === 'pending' || event.status === 'pending_review';
            const isApproved = event.status === 'approved' || event.status === 'response_assigned' || event.status === 'responding';
            const isRejected = event.status === 'rejected' || event.status === 'dismissed';
            const isResolved = event.status === 'resolved';

            return (
              <div 
                key={event._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: isPendingReview 
                    ? '1px solid rgba(245, 158, 11, 0.4)' 
                    : isRejected 
                    ? '1px solid rgba(239, 68, 68, 0.4)' 
                    : isApproved 
                    ? '1px solid rgba(16, 185, 129, 0.4)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '1rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Card Header: Source Badge + Severity Badge */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.35)', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                        🆘 Citizen Portal
                      </span>
                      {event.isSimulated && (
                        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                          DEMO
                        </span>
                      )}
                    </div>

                    <span className={`badge badge-${event.severity}`}>
                      {event.category ? event.category.toUpperCase() : 'SOS'} — {event.severity}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.35rem' }}>
                    {event.locationName || 'Unknown Location'}
                  </h4>

                  {/* Media Attachment Indicator Pill */}
                  {(() => {
                    const hasMedia = (Array.isArray(event.mediaEvidence) && event.mediaEvidence.length > 0) || (event.mediaUrl && !event.mediaUrl.startsWith('blob:'));
                    const isBlob = (Array.isArray(event.mediaEvidence) && event.mediaEvidence.some(m => m && m.url && m.url.startsWith('blob:'))) || (event.mediaUrl && event.mediaUrl.startsWith('blob:'));

                    if (isBlob) {
                      return (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                          <AlertTriangle size={11} /> Evidence unavailable — resubmit media
                        </div>
                      );
                    }

                    if (hasMedia) {
                      return (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                          <ImageIcon size={11} /> Attached Media Evidence Available
                        </div>
                      );
                    }

                    return null;
                  })()}

                  {/* Description */}
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 0.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.text}
                  </p>

                  {/* Citizen Contact Meta */}
                  {(event.citizenName || event.citizenPhone) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.45rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} color="var(--accent-color)" /> {event.citizenName || 'Citizen'}
                      </span>
                      {event.citizenPhone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} color="var(--accent-color)" /> {event.citizenPhone}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rejection Audit Box (if rejected) */}
                  {isRejected && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '0.65rem 0.85rem', fontSize: '0.78rem', color: '#fca5a5', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><strong style={{ color: '#ef4444' }}>❌ REJECTED</strong> — Reason: <span style={{ color: '#fff', fontWeight: 700 }}>"{event.rejectionReason || 'Dismissed by Operator'}"</span></div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                        Rejected by {event.rejectedBy || 'Operator'} {event.rejectedAt ? `at ${new Date(event.rejectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                      </div>
                    </div>
                  )}

                  {/* Telemetry Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }} className="font-mono">
                      {event.confidenceScore}% AI CONFIDENCE
                    </span>
                    {event.assignedTeam && (
                      <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
                        🚒 {event.assignedTeam}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Status Label + Action Buttons */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* Status Badge */}
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    textTransform: 'uppercase',
                    color: isApproved ? 'var(--success-color)' : isResolved ? '#38bdf8' : isRejected ? '#ef4444' : '#f59e0b'
                  }}>
                    STATUS: {isPendingReview ? 'PENDING REVIEW' : event.status ? event.status.replace('_', ' ').toUpperCase() : 'PENDING'}
                  </span>

                  {/* Action Button Group */}
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    
                    {/* View Details Modal Trigger */}
                    <button
                      onClick={() => setModalEvent(event)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Eye size={14} /> View Details
                    </button>

                    {/* Decision Buttons for PENDING_REVIEW incidents strictly */}
                    {isPendingReview && (
                      <>
                        <button
                          onClick={() => handleApprove(event._id)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                          }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>

                        <button
                          onClick={() => { setRejectModalEvent(event); setRejectionReason('False / Invalid Report'); setCustomReason(''); }}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
                          }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}

                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Shared Incident Details Modal */}
      {modalEvent && (
        <IncidentDetailModal 
          event={modalEvent} 
          onClose={() => setModalEvent(null)} 
        />
      )}

      {/* Reject Confirmation Modal */}
      {rejectModalEvent && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setRejectModalEvent(null)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '480px',
              background: '#0f172a',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
              animation: 'scaleUp 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                <AlertTriangle size={22} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Reject Citizen Incident?</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>ID: NX-CIT-{rejectModalEvent._id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Are you sure you want to reject this citizen report? The report will be stored in MongoDB as <strong style={{ color: '#ef4444' }}>REJECTED</strong> with full audit trail logging and evidence retention.
            </p>

            <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reason for Rejection *
                </label>
                <select
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="False / Invalid Report">False / Invalid Report</option>
                  <option value="Duplicate Incident">Duplicate Incident</option>
                  <option value="Insufficient Evidence">Insufficient Evidence</option>
                  <option value="Not a Disaster/Emergency">Not a Disaster/Emergency</option>
                  <option value="Location Invalid">Location Invalid</option>
                  <option value="Already Resolved">Already Resolved</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {rejectionReason === 'Other' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Specify Custom Reason *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter specific reason for rejection..."
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalEvent(null)}
                  style={{ padding: '0.7rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRejecting}
                  style={{ padding: '0.7rem 1.75rem', borderRadius: '10px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239,68,68,0.4)' }}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: 'rgba(16, 185, 129, 0.95)', color: '#ffffff',
          padding: '0.85rem 1.25rem', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', gap: '0.65rem',
          fontSize: '0.88rem', fontWeight: 700, zIndex: 3500,
          backdropFilter: 'blur(10px)', animation: 'fadeInUp 0.3s ease-out'
        }}>
          <CheckCircle size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
