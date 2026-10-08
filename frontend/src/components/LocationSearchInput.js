'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2, Check } from 'lucide-react';

export default function LocationSearchInput({ 
  onSelectLocation, 
  initialPlaceName = '', 
  placeholder = 'Search Indian city, district, or state...' 
}) {
  const [query, setQuery] = useState(initialPlaceName);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(initialPlaceName);
  }, [initialPlaceName]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to sanitize regional script characters (Tamil, Devanagari, etc.) into clean English
  const sanitizeEnglishLocation = (str) => {
    if (!str) return '';
    const cleaned = str
      .replace(/[\u0900-\u0DFF]/g, '') // Strip Indic script characters
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/^[\s,]+|[\s,]+$/g, '')
      .trim();
    return cleaned || str;
  };

  // Debounced Nominatim Geocoding Search scoped to India in English
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&accept-language=en&countrycodes=in&limit=6&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const formattedSuggestions = (data || []).map(item => ({
          ...item,
          display_name: sanitizeEnglishLocation(item.display_name)
        }));
        setSuggestions(formattedSuggestions);
        setIsOpen(true);
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Geolocation: "Use My Current Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding via Nominatim in English
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const rawDisplayName = sanitizeEnglishLocation(data.display_name);
          const placeName = rawDisplayName ? rawDisplayName.split(',').slice(0, 3).join(',').trim() : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          const locResult = {
            city: placeName,
            lat: latitude,
            lng: longitude,
            displayName: rawDisplayName || placeName
          };

          setQuery(placeName);
          setIsOpen(false);
          if (onSelectLocation) onSelectLocation(locResult);
        } catch (e) {
          const fallback = { city: `Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`, lat: latitude, lng: longitude };
          setQuery(fallback.city);
          if (onSelectLocation) onSelectLocation(fallback);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        alert('Unable to retrieve your location. Please check browser permissions.');
        setLocating(false);
      }
    );
  };

  const handleSelectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const cleanDisplayName = sanitizeEnglishLocation(item.display_name);
    const placeName = cleanDisplayName.split(',').slice(0, 3).join(',').trim();

    const locResult = {
      city: placeName,
      lat,
      lng,
      displayName: cleanDisplayName
    };

    setQuery(placeName);
    setSuggestions([]);
    setIsOpen(false);
    if (onSelectLocation) onSelectLocation(locResult);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="var(--accent-color)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          
          <input 
            type="text" 
            className="form-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            style={{ paddingLeft: '2.5rem', paddingRight: query ? '2.5rem' : '1rem' }}
          />

          {loading && (
            <Loader2 size={16} color="var(--accent-color)" className="animate-spin-slow" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          )}

          {query && !loading && (
            <button 
              type="button" 
              onClick={() => { setQuery(''); setSuggestions([]); }}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* GPS Current Location Button */}
        <button 
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          title="Detect my current location via GPS"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--accent-color)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          {locating ? <Loader2 size={16} className="animate-spin-slow" /> : <Navigation size={16} />}
          <span>{locating ? 'Locating...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          zIndex: 1500,
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '0.4rem'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', padding: '0.4rem 0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            OpenStreetMap India Locations ({suggestions.length})
          </div>

          {suggestions.map((item, idx) => (
            <div 
              key={item.place_id || idx}
              onClick={() => handleSelectSuggestion(item)}
              style={{
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                transition: 'background 0.15s ease',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MapPin size={16} color="var(--accent-color)" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.display_name.split(',')[0]}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.display_name}
                </div>
              </div>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                IN
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
