'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Send, 
  Upload, 
  MapPin, 
  CheckCircle, 
  Clock, 
  FileText, 
  Radio, 
  Image as ImageIcon, 
  X, 
  ShieldCheck, 
  Users,
  Navigation
} from 'lucide-react';
import LocationSearchInput from '../../components/LocationSearchInput';
import ReliefFundPanel from '../../components/ReliefFundPanel';

const presetLocations = [
  { city: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'New Delhi, Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { city: 'Wayanad, Kerala', lat: 11.6050, lng: 76.0830 },
  { city: 'Puri, Odisha', lat: 19.8135, lng: 85.8312 },
  { city: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362 }
];

export default function CitizenPortalPage() {
  const [alerts, setAlerts] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'alerts', 'track'

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('flood');
  const [severity, setSeverity] = useState('high');
  const [selectedLocation, setSelectedLocation] = useState(presetLocations[0]);
  const [peopleAffected, setPeopleAffected] = useState(4);
  const [text, setText] = useState('');
  const [citizenName, setCitizenName] = useState('Rohan Verma');
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/citizen/alerts');
      const data = await res.json();
      if (data.success) setAlerts(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyReports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/citizen/my-reports');
      const data = await res.json();
      if (data.success) setMyReports(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.all([fetchAlerts(), fetchMyReports()]).finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!title || !text) {
      showToast('Please provide an incident title and distress description');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/citizen/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          text,
          category,
          severity,
          locationName: selectedLocation.city,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          peopleAffected,
          citizenName,
          citizenPhone,
          mediaUrl: previewUrl || 'https://disaster.gov.in/media-proof.jpg'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Distress Incident Report successfully filed! Emergency teams notified.');
        setTitle('');
        setText('');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchMyReports();
        setActiveTab('track');
      }
    } catch (err) {
      showToast('Failed to file report');
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Citizen Disaster & Rescue Assistance</span>
            <span style={{ background: 'var(--accent-color)', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '10px' }}>ACTIVE PORTAL</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
            Report real-time disaster occurrences, upload ground photos/video evidence, share your GPS location, and track rescue response status.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', padding: '0.35rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            onClick={() => setActiveTab('report')}
            style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', background: activeTab === 'report' ? 'var(--accent-color)' : 'transparent', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={15} /> File SOS Report
          </button>

          <button 
            onClick={() => setActiveTab('track')}
            style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', background: activeTab === 'track' ? 'var(--accent-color)' : 'transparent', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Clock size={15} /> Track My Reports ({myReports.length})
          </button>

          <button 
            onClick={() => setActiveTab('alerts')}
            style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: 'none', background: activeTab === 'alerts' ? 'var(--accent-color)' : 'transparent', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertTriangle size={15} /> Live Alerts ({alerts.length})
          </button>
        </div>
      </div>

      {/* TAB 1: FILE NEW SOS / INCIDENT REPORT */}
      {activeTab === 'report' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Send size={22} color="var(--accent-color)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Submit Emergency SOS / Incident Report</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Direct intake into the NDRF / SDRF Neural Triage Engine</p>
            </div>
          </div>

          <form onSubmit={handleSubmitReport} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Left Form Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Incident Headline / Summary</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Waterlogging up to 4ft near Dadar Station"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Disaster Category</label>
                  <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="flood">Flood / Waterlogging</option>
                    <option value="fire">Commercial Fire</option>
                    <option value="collapse">Building Collapse / Landslide</option>
                    <option value="cyclone">Cyclone Storm</option>
                    <option value="medical">Medical Emergency</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Distress Level</label>
                  <select className="form-select" value={severity} onChange={e => setSeverity(e.target.value)}>
                    <option value="medium">Medium (Requires Assistance)</option>
                    <option value="high">High (Urgent Rescue Needed)</option>
                    <option value="critical">Critical (Life Threatening SOS)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Search Indian Location (City, District, State) or Use GPS</label>
                <LocationSearchInput 
                  initialPlaceName={selectedLocation.city}
                  onSelectLocation={(loc) => setSelectedLocation({ city: loc.city, lat: loc.lat, lng: loc.lng })}
                  placeholder="Type Indian location (e.g. Coimbatore, Wayanad, Chennai)..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <Navigation size={14} color="var(--accent-color)" />
                  <span style={{ color: 'var(--text-secondary)' }}>Coords:</span>
                  <strong style={{ color: '#ffffff' }} className="font-mono">{selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lng.toFixed(4)}° E</strong>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Est. Affected"
                    value={peopleAffected}
                    onChange={e => setPeopleAffected(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Detailed Situation Description</label>
                <textarea 
                  className="form-textarea" 
                  rows={4}
                  placeholder="Describe trapped victims, water level, blocked roads, or medical injuries..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Right Form Column: Media Upload & GPS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Photo & Video Upload Dropzone */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Attach Photo or Video Evidence</label>
                <div style={{
                  border: '2px dashed rgba(16, 185, 129, 0.35)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.04)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  <Upload size={32} color="var(--accent-color)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                    Click or Drag to Upload Incident Photo/Video
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Supports JPG, PNG, MP4 (Max 50MB). Auto-geotagged upon intake.
                  </p>
                </div>

                {/* Uploaded Media Preview */}
                {selectedFile && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <ImageIcon size={20} color="var(--accent-color)" />
                    <div style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </div>
                    <X size={16} color="var(--danger-color)" style={{ cursor: 'pointer' }} onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} />
                  </div>
                )}
              </div>

              {/* Citizen Contact Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" value={citizenName} onChange={e => setCitizenName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Phone (for Rescue Team)</label>
                  <input type="text" className="form-input" value={citizenPhone} onChange={e => setCitizenPhone(e.target.value)} />
                </div>
              </div>

              {/* GPS Coordinates Box */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                  <Navigation size={16} color="var(--accent-color)" />
                  <span style={{ color: 'var(--text-secondary)' }}>GPS Target Coordinates:</span>
                  <strong style={{ color: '#ffffff' }} className="font-mono">{selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lng.toFixed(4)}° E</strong>
                </div>
                <span className="badge badge-low">LOCKED</span>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-approve"
                style={{ padding: '0.95rem', fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <Send size={18} />
                {isSubmitting ? 'Transmitting Distress Report...' : 'Transmit SOS Incident Report'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: TRACK MY SUBMITTED REPORTS */}
      {activeTab === 'track' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <Clock size={22} color="#38bdf8" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Track Submitted Incident Reports</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Real-time verification & rescue team dispatch timeline</p>
              </div>
            </div>
            <button onClick={fetchMyReports} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              Refresh Status
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {myReports.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>No submitted reports found yet</p>
                <p style={{ fontSize: '0.82rem', marginTop: '0.4rem' }}>File an SOS incident report using the form above to track rescue progress.</p>
              </div>
            ) : (
              myReports.map((report) => (
                <div key={report._id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{report.locationName}</span>
                        <span className={`badge badge-${report.severity}`}>{report.severity}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{report.text}</p>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} className="font-mono">
                      Filed: {new Date(report.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Rescue Progression Timeline Bar */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                      Rescue Operations Progression
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', textAlign: 'center', position: 'relative' }}>
                      
                      <div style={{ padding: '0.65rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                        ✓ 1. Report Submitted
                      </div>

                      <div style={{ padding: '0.65rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                        ✓ 2. AI Triage Verified
                      </div>

                      <div style={{ padding: '0.65rem', borderRadius: '8px', background: report.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', border: report.status === 'approved' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)', color: report.status === 'approved' ? '#10b981' : '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
                        {report.status === 'approved' ? '✓ 3. NDRF Unit Dispatched' : '⏳ 3. Awaiting Dispatch'}
                      </div>

                      <div style={{ padding: '0.65rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                        4. Rescue Resolved
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ALERTS & SAFETY ADVISORIES */}
      {activeTab === 'alerts' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <AlertTriangle size={22} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Active National Disaster Alerts & Advisories</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Verified emergency alerts broadcast by NDRF & India Meteorological Department</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {alerts.map((alert) => (
              <div key={alert._id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="font-mono">{alert.locationName}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>{alert.text}</h4>
                </div>
                
                {/* Official Relief Funds Panel */}
                <ReliefFundPanel locationName={alert.locationName} compact={true} />

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>Category: <strong style={{ color: '#fff' }}>{alert.category.toUpperCase()}</strong></span>
                  <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>Confidence: {alert.confidenceScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.88rem',
          fontWeight: 700,
          zIndex: 2000,
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
