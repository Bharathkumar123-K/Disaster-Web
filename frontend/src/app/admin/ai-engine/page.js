'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../../../components/admin/AdminProvider';
import { 
  Cpu, 
  Sliders, 
  Tag, 
  Save, 
  AlertTriangle, 
  X, 
  Plus, 
  CheckCircle,
  Radio
} from 'lucide-react';

export default function AdminAiEnginePage() {
  const { aiConfig, saveAiConfig, loading } = useAdmin();

  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [duplicateRadiusKm, setDuplicateRadiusKm] = useState(15);
  const [autoDispatchEmergency, setAutoDispatchEmergency] = useState(false);
  const [keywordTriggers, setKeywordTriggers] = useState(['sos', 'trapped', 'landslide', 'tsunami', 'cloudburst', 'collapse', 'chemical leak']);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (aiConfig) {
      if (aiConfig.confidenceThreshold !== undefined) setConfidenceThreshold(aiConfig.confidenceThreshold);
      if (aiConfig.duplicateRadiusKm !== undefined) setDuplicateRadiusKm(aiConfig.duplicateRadiusKm);
      if (aiConfig.autoDispatchEmergency !== undefined) setAutoDispatchEmergency(aiConfig.autoDispatchEmergency);
      if (aiConfig.keywordTriggers) setKeywordTriggers(aiConfig.keywordTriggers);
    }
  }, [aiConfig]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !keywordTriggers.includes(newTag.trim().toLowerCase())) {
      setKeywordTriggers([...keywordTriggers, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setKeywordTriggers(keywordTriggers.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveAiConfig({
      confidenceThreshold,
      duplicateRadiusKm,
      autoDispatchEmergency,
      keywordTriggers
    });
    setIsSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '16px', padding: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>AI NLP Triage & Rules Calibration</span>
            <span className="admin-badge">INTELLIGENCE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Fine-tune NLP classifier confidence cutoffs, deduplication radiuses, and alert keyword tags.
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn btn-approve"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#ffffff', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
        >
          <Save size={16} />
          {isSaving ? 'Saving Calibration...' : 'Save AI Parameters'}
        </button>
      </div>

      {/* Main Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Sliders Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <Sliders size={18} color="#f59e0b" />
            <span>Threshold & Clustering Parameters</span>
          </div>

          {/* Confidence Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>NLP Triage Cutoff Confidence Score</label>
              <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
                {confidenceThreshold}%
              </span>
            </div>
            <input 
              type="range" 
              min={50} 
              max={95} 
              value={confidenceThreshold} 
              onChange={e => setConfidenceThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Incoming posts scoring below {confidenceThreshold}% confidence will be filtered out before dispatch triage.
            </p>
          </div>

          {/* Duplicate Radius Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Deduplication Cluster Radius (KM)</label>
              <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#06b6d4' }}>
                {duplicateRadiusKm} KM
              </span>
            </div>
            <input 
              type="range" 
              min={5} 
              max={50} 
              value={duplicateRadiusKm} 
              onChange={e => setDuplicateRadiusKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Similar reports within {duplicateRadiusKm} KM are grouped into a single master disaster incident.
            </p>
          </div>

          {/* Auto Dispatch Toggle */}
          <div className="switch-label">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#ffffff' }}>Auto-Dispatch Critical Emergency Events</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Auto-approve critical incidents scoring {'>'}90% confidence</div>
            </div>
            <input 
              type="checkbox" 
              className="switch-input" 
              checked={autoDispatchEmergency} 
              onChange={e => setAutoDispatchEmergency(e.target.checked)}
            />
          </div>
        </div>

        {/* Keyword Alert Tags Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <Tag size={18} color="var(--accent-color)" />
            <span>High-Priority Emergency Keyword Triggers</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Posts matching any of these high-priority triggers are instantly flagged for urgent commander verification regardless of baseline score.
          </p>

          <form onSubmit={handleAddTag} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Add keyword (e.g. avalanche, dam breach)"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
            />
            <button type="submit" className="btn btn-approve" style={{ padding: '0.65rem 1rem' }}>
              <Plus size={16} /> Add
            </button>
          </form>

          {/* Tags Chips Container */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
            {keywordTriggers.map((tag) => (
              <span 
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: 'var(--accent-color)',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                #{tag}
                <X 
                  size={14} 
                  style={{ cursor: 'pointer', opacity: 0.8 }} 
                  onClick={() => handleRemoveTag(tag)} 
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
