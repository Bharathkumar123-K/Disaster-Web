'use client';

import { useState } from 'react';
import { useAdmin } from './AdminProvider';
import { X, Send, AlertOctagon, MapPin, Layers, Users, Navigation } from 'lucide-react';
import LocationSearchInput from '../LocationSearchInput';

import NexusSelect from '../NexusSelect';

export default function InjectIncidentModal() {
  const { isInjectModalOpen, setIsInjectModalOpen, injectIncident } = useAdmin();

  const [title, setTitle] = useState('Flash Flood & Urban Inundation Alert');
  const [category, setCategory] = useState('flood');
  const [severity, setSeverity] = useState('critical');
  const [locationName, setLocationName] = useState('Mumbai, Maharashtra');
  const [lat, setLat] = useState(19.0760);
  const [lng, setLng] = useState(72.8777);
  const [peopleAffected, setPeopleAffected] = useState(650);
  const [agency, setAgency] = useState('NDRF');
  const [text, setText] = useState('Severe flash flood alert issued. Water levels rising rapidly near main arterial highways. Emergency evacuation units deployed.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isInjectModalOpen) return null;

  const handleLocationSelect = (loc) => {
    setLocationName(loc.city);
    setLat(loc.lat);
    setLng(loc.lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await injectIncident({
      title,
      text,
      category,
      severity,
      locationName,
      lat,
      lng,
      peopleAffected,
      agency
    });
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <AlertOctagon size={20} color="var(--accent-color)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Inject Simulated Disaster Incident</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Broadcast a custom emergency event live across all dispatch terminals</p>
            </div>
          </div>
          <button onClick={() => setIsInjectModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Incident Headline / Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Disaster Category</label>
              <NexusSelect 
                value={category} 
                onChange={(e, val) => setCategory(val)}
                options={[
                  { value: 'flood', label: 'Flood / Inundation' },
                  { value: 'cyclone', label: 'Cyclone / Storm' },
                  { value: 'fire', label: 'Fire / Hazmat' },
                  { value: 'collapse', label: 'Landslide / Collapse' },
                  { value: 'roadblock', label: 'Road Blockade / Transit' }
                ]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Severity Level</label>
              <NexusSelect 
                value={severity} 
                onChange={(e, val) => setSeverity(val)}
                options={[
                  { value: 'low', label: 'Low (Monitoring)' },
                  { value: 'medium', label: 'Medium (Moderate)' },
                  { value: 'high', label: 'High (Urgent Dispatch)' },
                  { value: 'critical', label: 'Critical (Emergency Priority)' }
                ]}
              />
            </div>
          </div>

          {/* India Location Autocomplete Input */}
          <div className="form-group">
            <label className="form-label">Search Indian Location (City, District, State)</label>
            <LocationSearchInput 
              initialPlaceName={locationName}
              onSelectLocation={handleLocationSelect}
              placeholder="Type city/district in India (e.g., Coimbatore, Wayanad, Chennai)..."
            />
          </div>

          {/* Coordinates & People Affected */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
              <Navigation size={14} color="var(--accent-color)" />
              <span style={{ color: 'var(--text-secondary)' }}>Coords:</span>
              <strong style={{ color: '#ffffff' }} className="font-mono">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</strong>
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

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Recommended Response Department</label>
            <NexusSelect 
              value={agency} 
              onChange={(e, val) => setAgency(val)}
              options={[
                { value: 'NDRF', label: 'NDRF (National Disaster Response Force)' },
                { value: 'SDRF', label: 'SDRF (State Relief Unit)' },
                { value: 'Coast Guard', label: 'Indian Coast Guard' },
                { value: 'Fire Department', label: 'Fire & Emergency Services' },
                { value: 'Medical Airwing', label: '108 Emergency Airwing' }
              ]}
            />
          </div>


          <div className="form-group">
            <label className="form-label">Incident Description & Telemetry</label>
            <textarea 
              className="form-textarea" 
              rows={3} 
              value={text} 
              onChange={e => setText(e.target.value)} 
              required 
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
            <button 
              type="button" 
              onClick={() => setIsInjectModalOpen(false)}
              className="btn btn-dismiss"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-approve"
              style={{ flex: 2, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              <Send size={16} />
              {isSubmitting ? 'Injecting Payload...' : 'Broadcast Live Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
