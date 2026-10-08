'use client';

import { useState } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bot, 
  User, 
  Phone, 
  Clock, 
  Shield, 
  Send, 
  Truck, 
  FileText, 
  Navigation,
  Globe,
  Radio,
  ImageIcon,
  ExternalLink
} from 'lucide-react';
import { useDisaster } from './DisasterProvider';
import NexusSelect from './NexusSelect';


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const resolveMediaUrl = (url) => {
  if (!url || url.startsWith('blob:')) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return `${API_BASE}/${url}`;
};

const getMediaEvidenceList = (evt) => {
  if (!evt) return [];
  const items = [];

  // Inspect mediaEvidence array
  if (Array.isArray(evt.mediaEvidence) && evt.mediaEvidence.length > 0) {
    evt.mediaEvidence.forEach(item => {
      if (item && item.url) {
        if (item.url.startsWith('blob:')) {
          items.push({ isBlob: true, originalName: item.originalName });
        } else {
          const fullUrl = resolveMediaUrl(item.url);
          const isVideo = item.type === 'video' || item.url.match(/\.(mp4|webm)$/i);
          items.push({
            mediaId: item.mediaId || `med_${Math.random()}`,
            url: fullUrl,
            rawUrl: item.url,
            type: isVideo ? 'video' : 'image',
            originalName: item.originalName || 'attached_evidence'
          });
        }
      }
    });
  }

  // Fallback to mediaUrl or url if array was empty
  if (items.length === 0 && (evt.mediaUrl || evt.url)) {
    const rawUrl = evt.mediaUrl || evt.url;
    if (rawUrl.startsWith('blob:')) {
      items.push({ isBlob: true });
    } else if (rawUrl.startsWith('/uploads/') || rawUrl.startsWith('http')) {
      const fullUrl = resolveMediaUrl(rawUrl);
      const isVideo = rawUrl.match(/\.(mp4|webm)$/i);
      items.push({
        mediaId: `med_legacy_${evt._id}`,
        url: fullUrl,
        rawUrl: rawUrl,
        type: isVideo ? 'video' : 'image',
        originalName: 'attached_evidence'
      });
    }
  }

  return items;
};

export default function IncidentDetailModal({ event, onClose }) {
  const { updateEventDetails, addOperatorNote, assignResponseTeam, getRecommendation } = useDisaster();

  const [status, setStatus] = useState(event.status || 'pending');
  const [priorityLevel, setPriorityLevel] = useState(event.priorityLevel || 'urgent');
  const [assignedTeam, setAssignedTeam] = useState(event.assignedTeam || '');
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!event) return null;

  const rec = getRecommendation(event._id);
  const isCitizen = event.sourceType === 'CITIZEN' || event.sourceType === 'CITIZEN_REPORT' || event.sourceType === 'CITIZEN_PORTAL' || event.sourceType === 'CITIZEN_SOS';

  // Format Source Badge Label
  const getSourceBadge = () => {
    if (isCitizen) return { label: '🆘 Citizen Portal', bg: 'rgba(244, 63, 94, 0.18)', color: '#f43f5e', border: 'rgba(244, 63, 94, 0.4)' };
    const src = (event.sourceType || 'AI_DETECTED').toUpperCase();
    if (src.includes('WEATHER')) return { label: '🌤️ Weather API', bg: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)' };
    if (src.includes('GOV')) return { label: '🏛️ Government Alert', bg: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' };
    if (src.includes('NEWS') || src.includes('RSS')) return { label: '📰 News / RSS', bg: 'rgba(168, 85, 247, 0.18)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.4)' };
    if (src.includes('SOCIAL') || src.includes('TWITTER')) return { label: '💬 Social Media', bg: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.4)' };
    if (src.includes('SENSOR')) return { label: '📡 Sensor Network', bg: 'rgba(20, 184, 166, 0.18)', color: '#2dd4bf', border: 'rgba(20, 184, 166, 0.4)' };
    return { label: '🤖 AI Detection', bg: 'rgba(16, 185, 129, 0.18)', color: '#10b981', border: 'rgba(16, 185, 129, 0.4)' };
  };

  const sourceBadge = getSourceBadge();

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateEventDetails(event._id, {
        status,
        priorityLevel,
        assignedTeam,
        note: noteText
      });
      if (noteText) setNoteText('');
      setSaveSuccessMsg('Incident updates & operator notes saved successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const handleQuickAssign = async (teamName) => {
    setAssignedTeam(teamName);
    setStatus('response_assigned');
    await assignResponseTeam(event._id, teamName, priorityLevel);
    setSaveSuccessMsg(`Response team "${teamName}" assigned successfully!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleAddNoteOnly = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSaving(true);
    await addOperatorNote(event._id, noteText.trim());
    setNoteText('');
    setIsSaving(false);
    setSaveSuccessMsg('Operator note added to audit trail.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 2500,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          background: '#0f172a',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span style={{
                background: sourceBadge.bg,
                color: sourceBadge.color,
                border: `1px solid ${sourceBadge.border}`,
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '12px'
              }}>
                {sourceBadge.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="font-mono">
                ID: {isCitizen ? 'NX-CIT-' : 'NX-EXT-'}{event._id.slice(-6).toUpperCase()}
              </span>
              {event.isSimulated && (
                <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#f59e0b', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                  DEMO / SIMULATED
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {event.locationName || 'Unknown Sector'} — {event.category ? event.category.toUpperCase() : 'EMERGENCY'}
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Overview Grid & Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            
            {/* Left Description Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 700 }}>
                Incident Description & Field Report
              </h4>
              <p style={{ fontSize: '0.95rem', color: '#ffffff', lineHeight: '1.6', margin: 0 }}>
                {event.text}
              </p>

              {/* Citizen Contact Details if present */}
              {isCitizen && (event.citizenName || event.citizenPhone) && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <User size={14} color="var(--accent-color)" /> Citizen: <strong style={{ color: '#fff' }}>{event.citizenName || 'Anonymous'}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <Phone size={14} color="var(--accent-color)" /> Contact: <strong style={{ color: '#fff' }}>{event.citizenPhone || 'N/A'}</strong>
                  </div>
                </div>
              )}

              {/* Attached Photo/Video Media Evidence Section */}
              {(() => {
                const mediaList = getMediaEvidenceList(event);
                if (mediaList.length === 0) return null;

                return (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ImageIcon size={16} color="var(--accent-color)" /> Attached Media Evidence
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {mediaList.filter(m => !m.isBlob).length} File(s)
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {mediaList.map((item, idx) => {
                        if (item.isBlob) {
                          return (
                            <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <AlertTriangle size={18} color="#ef4444" />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5' }}>
                                  Evidence unavailable — please resubmit media.
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                                  Temporary browser blob URL detected. Media was not stored persistently.
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={item.mediaId || idx} style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {item.type === 'video' ? '📹 Video Evidence' : '📷 Image Evidence'}: <span style={{ color: 'var(--text-secondary)' }}>{item.originalName}</span>
                              </span>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '8px',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  border: '1px solid rgba(56, 189, 248, 0.4)',
                                  color: '#38bdf8',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  textDecoration: 'none'
                                }}
                              >
                                <ExternalLink size={13} /> Open Evidence
                              </a>
                            </div>

                            {item.type === 'image' ? (
                              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: '#000' }} onClick={() => setLightboxImage(item.url)}>
                                <img 
                                  src={item.url} 
                                  alt={item.originalName}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.innerHTML = `
                                      <div style="padding: 1.5rem; text-align: center; color: #ef4444; font-size: 0.82rem; font-weight: 700;">
                                        ⚠️ Evidence unavailable — file missing or unreadable on server.
                                      </div>
                                    `;
                                  }}
                                  style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }} 
                                />
                                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
                                  🔍 Click to Enlarge
                                </div>
                              </div>
                            ) : (
                              <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <video 
                                  controls 
                                  preload="metadata"
                                  style={{ width: '100%', maxHeight: '320px', display: 'block' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.innerHTML = `
                                      <div style="padding: 1.5rem; text-align: center; color: #ef4444; font-size: 0.82rem; font-weight: 700;">
                                        ⚠️ Evidence unavailable — video missing or format unplayable.
                                      </div>
                                    `;
                                  }}
                                >
                                  <source src={item.url} type="video/mp4" />
                                  <source src={item.url} type="video/webm" />
                                  Your browser does not support HTML5 video playback.
                                </video>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right Telemetry Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Severity Level:</span>
                  <span className={`badge badge-${event.severity}`}>{event.severity ? event.severity.toUpperCase() : 'HIGH'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>AI Confidence:</span>
                  <strong style={{ color: '#38bdf8' }} className="font-mono">{event.confidenceScore}% MATCH</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>People Affected:</span>
                  <strong style={{ color: '#ffffff' }} className="font-mono">{event.peopleAffected} citizens</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Reported Time:</span>
                  <strong style={{ color: '#ffffff' }}>{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GPS Target:</span>
                  <strong style={{ color: 'var(--accent-color)' }} className="font-mono">
                    {event.location?.coordinates ? `${event.location.coordinates[1].toFixed(3)}°N, ${event.location.coordinates[0].toFixed(3)}°E` : 'Geocoded'}
                  </strong>
                </div>
              </div>

              {/* AI Dispatch Recommendation */}
              {rec && (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.8rem' }}>
                  <div style={{ color: 'var(--accent-color)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.25rem' }}>
                    <Bot size={14} /> AI Suggested Dispatch
                  </div>
                  <div style={{ color: '#ffffff', fontWeight: 700 }}>
                    {rec.suggestedDepartment} ({rec.priorityLevel.toUpperCase()})
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                    {rec.suggestedResources ? rec.suggestedResources.join(', ') : 'Tactical Unit'}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Section 2: Operator Dispatch & Status Form */}
          <form onSubmit={handleSaveAll} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.65rem' }}>
              <Truck size={18} color="var(--accent-color)" /> Operator Command Controls & Response Assignment
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1rem' }}>
              
              {/* Status Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Update Incident Status
                </label>
                <NexusSelect 
                  value={status} 
                  onChange={(e, val) => setStatus(val)}
                  options={[
                    { value: 'pending', label: '⏳ Pending Operator Review' },
                    { value: 'approved', label: '✅ Approved & Dispatched' },
                    { value: 'response_assigned', label: '🚒 Response Team Assigned' },
                    { value: 'resolved', label: '🟢 Rescue Resolved' },
                    { value: 'dismissed', label: '❌ Dismissed / False Alarm' }
                  ]}
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Set Dispatch Priority
                </label>
                <NexusSelect 
                  value={priorityLevel} 
                  onChange={(e, val) => setPriorityLevel(val)}
                  options={[
                    { value: 'routine', label: 'Routine (Level 3)' },
                    { value: 'urgent', label: 'Urgent (Level 2)' },
                    { value: 'emergency', label: 'Emergency SOS (Level 1)' }
                  ]}
                />
              </div>


              {/* Assign Response Team */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Assign Response Team / Agency
                </label>
                <input 
                  type="text" 
                  value={assignedTeam} 
                  onChange={e => setAssignedTeam(e.target.value)}
                  placeholder="e.g. NDRF 8th Bn / Mumbai Fire" 
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

            </div>

            {/* Preset Quick Assign Chips */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                Quick Assign Agency Presets:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['NDRF 8th Battalion', 'SDRF Disaster Cell', 'Regional Fire & Rescue', '108 Ambulance Fleet', 'Indian Coast Guard Unit'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuickAssign(preset)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '16px',
                      background: assignedTeam === preset ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: assignedTeam === preset ? '1px solid var(--accent-color)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: assignedTeam === preset ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Operator Notes Box & Log */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                Add Operator Log Note
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input 
                  type="text" 
                  value={noteText} 
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Enter dispatch note, field status, or casualty update..." 
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleAddNoteOnly}
                  disabled={!noteText.trim() || isSaving}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Add Note
                </button>
              </div>

              {/* Existing Operator Notes Trail */}
              {event.operatorNotes && event.operatorNotes.length > 0 && (
                <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {event.operatorNotes.map((n, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.55rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', borderLeft: '3px solid var(--accent-color)' }}>
                      <span style={{ color: '#ffffff' }}>"{n.text}"</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        {n.author || 'Operator'} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Success Message Banner */}
            {saveSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10b981" /> {saveSuccessMsg}
              </div>
            )}

            {/* Save All Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
              >
                Close Modal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-approve"
                style={{ padding: '0.75rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.88rem', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
              >
                {isSaving ? 'Saving Incident Updates...' : 'Save & Update Incident'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 3500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <img 
              src={lightboxImage} 
              alt="Full resolution evidence" 
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '14px', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }} 
            />
            <button 
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '-15px', right: '-15px',
                background: '#ef4444', color: '#fff', border: '2px solid #fff', borderRadius: '50%',
                width: '36px', height: '36px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
